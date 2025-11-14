import skillsLexicon from '../data/skills.json' assert {type: 'json'}

export function extractResumeFields(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean) 
  const results = {
    name: findName(lines),
    education: findEducation(lines),
    experience: findExperience(lines),
    location: findLocation(lines),
    skills: findSkills(text),
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

function findEducation(lines) {
  const keywords = ['bachelor', 'master', 'phd', 'university', 'college', 'degree', 'school', 'ba', 'bs', 'ma', 'ms', 'graduated']
  const candidates = []

  lines.forEach((line, i) => {
    const lower = line.toLowerCase()
    const keywordCount = keywords.filter(k => lower.includes(k)).length
    const positionalBoost = i < 10 ? 0.2 : 0
    const score = keywordCount * 0.3 + positionalBoost
    if (score > 0.3) candidates.push({ line, score })
  })

  if (candidates.length === 0)
    return { value: null, confidence: 0.2, rule: 'No education cues found' }

  const best = candidates.sort((a, b) => b.score - a.score)[0]
  return {
    value: best.line,
    confidence: Math.min(best.score + 0.3, 1),
    rule: 'Contains education-related words + early position',
  }
}

function findExperience(lines) {
   const jobCues = ['experience', 'intern', 'manager', 'developer', 'engineer', 'company', 'worked']
  const timeCues = ['present', 'responsible', 'years', 'months', 'previous']
  const candidates = []

  lines.forEach((line, i) => {
    const lower = line.toLowerCase()
    const score =
      (jobCues.filter(k => lower.includes(k)).length * 0.3) +
      (timeCues.filter(k => lower.includes(k)).length * 0.2) +
      (i < lines.length * 0.7 ? 0.1 : 0)
    if (score > 0.4) candidates.push({ line, score })
  })

  if (candidates.length === 0)
    return { value: null, confidence: 0.2, rule: 'No job-related cues found' }

  const best = candidates.sort((a, b) => b.score - a.score)[0]
  return {
    value: best.line,
    confidence: Math.min(best.score + 0.2, 1),
    rule: 'Contains job-related cues and mid-position',
  }
}

function findLocation(lines) {
  const locRegex = /(San Francisco|New York|Seattle|Austin|Toronto|London)/i 
  const match = lines.find(l => locRegex.test(l)) 
  return match
    ? { value: match, confidence: 0.7, rule: 'Known city list' }
    : { value: null, confidence: 0.3, rule: 'No city found' } 
}

function findSkills(text) {
  const lower = text.toLowerCase() 
  const found = skillsLexicon.filter(skill => lower.includes(skill.toLowerCase())) 
  const confidence = found.length > 5 ? 0.9 : found.length > 0 ? 0.6 : 0.2 
  return {
    value: found,
    confidence,
    rule: 'Lexicon keyword match',
  } 
}
