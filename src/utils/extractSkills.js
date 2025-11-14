export function extractSkills({ resume, jd = "", mode = "Hybrid", lexicon = [] }) {
  const resumeText = resume.toLowerCase();
  const jdKeywords = (jd || "").toLowerCase().split(/\W+/).filter(w => w.length > 2);

  const results = lexicon.map(skill => {
    if (!skill || !skill.skill) return null;
    const inResume = resumeText.includes(skill.skill.toLowerCase());
    const inJD = jdKeywords.includes(skill.skill.toLowerCase());

    if (mode === "Lexicon only" && !inResume) return null;
    if (mode === "JD only" && !inJD) return null;
    if (mode === "Hybrid" && !inResume && !inJD) return null;

    return {
      skill: skill.skill,
      category: skill.category,
      source: inJD && !inResume ? "jd" : inResume ? "lexicon" : "auto",
      match: inJD && inResume ? 1 : inResume ? 0.8 : inJD ? 0.6 : 0,
    };
  }).filter(Boolean);

  const totalFound = results.length
  const inBothResumeAndJD = results.filter(r => r.inResume && r.inJD).length
  const inResumeOnly = results.filter(r => r.inResume && !r.inJD).length
  const inJDOnly = results.filter(r => !r.inResume && r.inJD).length

  const jdSkillsCount = results.filter(r => r.inJD).length
  const matchPercent = jdSkillsCount > 0 
    ? Math.round((inBothResumeAndJD / jdSkillsCount) * 100)
    : 0

  //const resumeOnly = []; // Skills in resume but not in lexicon or JD
//   resumeText.split(/\W+/).forEach(word => {
//     if (!results.find(r => r.skill.toLowerCase() === word) && word.length > 2) {
//       resumeOnly.push({ name: word, category: "Other", source: "auto", match: 0.4 });
//     }
//   });

  return { 
    results,
    matchPercent,
    stats: {
        total: totalFound,
        inBothResumeAndJD,
        inResumeOnly,
        inJDOnly
    } 
}
}
