import skillsLexicon from '../data/skills.json' assert {type: 'json'}

export function extractResumeFields(text, jdKeywords = []) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean) 
  const results = {
    name: findName(lines),
    education: findEducation(lines),
    experience: findExperience(lines, jdKeywords),
    location: findLocation(lines),
    //skills: findSkills(text),
  } 
  return results 
}

function findName(lines) {
  const first = lines[0] || ''
  const words = first.split(' ')
  const capitalizedWords = words.filter(
    w => w[0] && w[0] === w[0].toUpperCase() && w.slice(1).toLowerCase() === w.slice(1)
  )
  // Scoring logic
  const score =
    (words.length >= 2 && words.length <= 4 ? 0.5 : 0) +
    (capitalizedWords.length === words.length ? 0.4 : 0) +
    (first.length < 40 ? 0.1 : 0)

  return {
    value: first,
    confidence: Math.min(score, 1),
    rule: 'First line capitalization and length pattern',
  }
}

export function findEducation(lines) {
  // Normalize lines for PDF artifacts
  const normalized = lines.map(line =>
    line
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );

  // Degree and school patterns
  const degreeRegex = /\b(ba|bs|bfa|ma|ms|mba|mfa|phd|jd|md|associate|bachelor|master|doctor|certificate|certification)\b/i;
  const schoolRegex =
    /\b(university|college|institute|academy|polytechnic|school|state|institute of technology)\b/i;

  // Expand lines by splitting on separators
  const expanded = normalized.flatMap(line =>
    line.split(/[–—\-•|]/).map(s => s.trim()).filter(Boolean)
  );

  const candidates = expanded.map((line, i) => {
    const text = line.toLowerCase();
    return {
      line,
      index: i,
      hasDegree: degreeRegex.test(text),
      hasSchool: schoolRegex.test(text),
      score:
        (degreeRegex.test(text) ? 0.6 : 0) +
        (schoolRegex.test(text) ? 0.6 : 0) +
        (i < 15 ? 0.2 : 0) // early appearance
    };
  }).filter(c => c.hasDegree || c.hasSchool);

  if (!candidates.length) {
    return { value: [], confidence: 0.2, rule: "No education cues found" };
  }

  const structured = [];

  // Merge lines: degree + school in same or adjacent lines
  for (let i = 0; i < candidates.length; i++) {
    const curr = candidates[i];
    const next = candidates[i + 1];

    let school = null;
    let degree = null;
    let field = null;

    // Determine which part is degree / school
    if (curr.hasSchool) school = curr.line;
    if (curr.hasDegree) degree = curr.line;

    if (
      next &&
      Math.abs(curr.index - next.index) === 1 &&
      ((curr.hasDegree && next.hasSchool) || (curr.hasSchool && next.hasDegree))
    ) {
      if (!school && next.hasSchool) school = next.line;
      if (!degree && next.hasDegree) degree = next.line;
      i++; // skip next line
    }

    // Extract field from degree line if possible
    if (degree) {
      // Remove degree acronym from start
      const match = degree.match(/\b(ba|bs|bfa|ma|ms|mba|mfa|phd|jd|md|associate|bachelor|master|doctor|certificate|certification)\b/i);
      if (match) {
        field = degree.replace(match[0], '').trim().replace(/^[:,\-–—]\s*/, '');
        degree = match[0].toUpperCase();
      } else {
        field = '';
      }
    }

    // Only keep if both school and degree exist
    if (school && degree) {
      structured.push({
        school,
        degree,
        field,
        lineIndex: curr.index,
        confidence: Math.min(curr.score, 1)
      });
    }
  }

  return {
    value: structured,
    confidence: structured.length > 0 ? structured[0].confidence : 0.2,
    rule: "Detected structured degree + school entries with multi-line merge"
  };
}

function findExperience(lines, jdKeywords = []) {
  //const jobCues = ['experience', 'intern', 'manager', 'developer', 'engineer', 'company', 'worked', 'designer', 'UI', 'UX']
  //const timeCues = ['present', 'responsible', 'years', 'months', 'previous']
  //const candidates = []
  const experience = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    const headerRegex = /(.*)\s+\|\s+(.*)\s+(\d{4})\s*-\s*(\d{4}|Present)/i
    const match = line.match(headerRegex)
    if (match) {
      const [_, title, company, start, end] = match
      const bullets = []
      i++;
      while (i < lines.length && lines[i].trim() !== "") {
        bullets.push(lines[i].replace(/^[-•\s]+/, '').trim( ))
        i++;
      }

   // Keyword match against job description
      let matchCount = 0;
      bullets.forEach(b => {
        jdKeywords.forEach(k => {
          if (b.toLowerCase().includes(k.toLowerCase())) matchCount++;
        });
      });

      const confidence = jdKeywords.length > 0 ? Math.min(matchCount / jdKeywords.length, 1) : 0.8;

      experience.push({ title, company, start, end, bullets, confidence });
    } else {
      i++;
    }
  }

  return {
    value: experience,
    confidence: experience.length > 0 ? experience[0].confidence : 0.2,
    rule: "Parsed jobs and matched bullets against job description"
  }
}

function findLocation(lines) {
  const locRegex = /(San Francisco|New York|Seattle|Austin|Toronto|London)/i 
  const match = lines.find(l => locRegex.test(l)) 
  return match
    ? { value: match, confidence: 0.7, rule: 'Known city list' }
    : { value: null, confidence: 0.3, rule: 'No city found' } 
}

// function findSkills(text) {
//   const lower = text.toLowerCase() 
//   const found = skillsLexicon.filter(skill => lower.includes(skill.toLowerCase())) 
//   const confidence = found.length > 5 ? 0.9 : found.length > 0 ? 0.6 : 0.2 
//   return {
//     value: found,
//     confidence,
//     rule: 'Lexicon keyword match',
//   } 
// }
