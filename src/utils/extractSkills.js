export function extractSkills({ resume, jd = "", mode = "Hybrid", lexicon = [] }) {
  const resumeText = resume.toLowerCase();
  const jdKeywords = (jd || "").toLowerCase().split(/\W+/).filter(w => w.length > 2);

  console.log('JD keywords:', jdKeywords.slice(0, 10))
  const containsSkill = (text, skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    return regex.test(text)
  }

  const results = lexicon.map(skill => {
    if (!skill || !skill.skill) return null;
    const skillLower = skill.skill.toLowerCase();
    const inResume = containsSkill(resumeText, skillLower)||
       (skill.aliases || []).some(alias => containsSkill(resumeText, alias.toLowerCase()))
    const inJD = jdKeywords.some(keyword => 
        keyword === skillLower || (skill.aliases || []).some(alias => keyword === alias.toLowerCase())
    )

    if (mode === "Lexicon only" && !inResume) return null;
    if (mode === "JD only" && !inJD) return null;
    if (mode === "Hybrid" && !inResume && !inJD) return null;

    return {
      skill: skill.skill,
      category: skill.category,
      source: inJD && !inResume ? "jd" : inResume ? "lexicon" : "auto",
      match: inJD && inResume ? 1 : inResume ? 0.8 : inJD ? 0.6 : 0,
      inResume,
      inJD
    };
  }).filter(Boolean);

  const totalFound = results.length
  const inBoth = results.filter(r => r.inResume && r.inJD).length
  const inResumeOnly = results.filter(r => r.inResume && !r.inJD).length
  const inJDOnly = results.filter(r => !r.inResume && r.inJD).length

 let matchPercent = 0;
  if (mode === "Lexicon only") {
    // For lexicon-only mode, show percentage of lexicon skills found
    matchPercent = lexicon.length > 0 
      ? Math.round((totalFound / lexicon.length) * 100)
      : 0;
  } else {
    // For JD/Hybrid modes, show how many JD skills are in resume
    const jdSkillsCount = results.filter(r => r.inJD).length;
    matchPercent = jdSkillsCount > 0 
      ? Math.round((inBoth / jdSkillsCount) * 100) 
      : 0;
  }

  return { 
    results,
    matchPercent,
    stats: {
        total: totalFound,
        inBoth: inBoth,
        inResumeOnly,
        inJDOnly
    } 
}
}
