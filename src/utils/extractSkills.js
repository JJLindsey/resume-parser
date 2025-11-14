export function extractSkills({ resume, jd = "", mode = "Hybrid", lexicon = [] }) {
  const resumeText = resume.toLowerCase();
  const jdKeywords = (jd || "").toLowerCase().split(/\W+/).filter(w => w.length > 2);

  const results = lexicon.map(skill => {
    if (!skill || !skill.skill) return null;
    const inResume = resumeText.includes(skill.skill.toLowerCase());
    const inJD = jdKeywords.includes(skill.skill.toLowerCase());

    if (mode === "Lexicon only" && !inResume) return null;
    if (mode === "JD only" && !inJD) return null;

    return {
      skill: skill.skill,
      category: skill.category,
      source: inJD && !inResume ? "jd" : inResume ? "lexicon" : "auto",
      match: inJD && inResume ? 1 : inResume ? 0.8 : inJD ? 0.6 : 0,
    };
  }).filter(Boolean);

  const resumeOnly = []; // Skills in resume but not in lexicon or JD
//   resumeText.split(/\W+/).forEach(word => {
//     if (!results.find(r => r.skill.toLowerCase() === word) && word.length > 2) {
//       resumeOnly.push({ name: word, category: "Other", source: "auto", match: 0.4 });
//     }
//   });

  const matchPercent = Math.round((results.filter(r => r.match >= 0.8).length / lexicon.length) * 100);

  return { results: [...results, ...resumeOnly], matchPercent };
}
