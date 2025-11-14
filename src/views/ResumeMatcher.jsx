import { useState } from "react"
import ExtractorUI from "../components/ExtractorUI"
import JobDescriptionInput from "../components/JobDescriptionInput"
import { extractResumeFields } from "../utils/heuristics"
import { extractSkills } from "../utils/extractSkills"
import skillsLexicon from '../data/skills.json' with {type: 'json'}

import { Box, Paper, Typography, LinearProgress, Chip, Grid } from "@mui/material"

export default function ResumeMatcher() {
    const [jobDescription, setJobDescription] = useState('')
    const [resumeText, setResumeText] = useState('')
    const [skillsResults, setSkillsResults] = useState(null)
    const [mode, setMode] = useState('hybrid')
    const [heuristicsResults, setHeuristicsResults] = useState(null)
    //const [loading, setLoading] = useState(false)

    const handleExtract = () => {
        const jdKeywords = jobDescription
            .toLowerCase()
            .split(/\W+/)
            .filter(w => w.length > 2)
        const heuristics = extractResumeFields(resumeText, jdKeywords);
            setHeuristicsResults(heuristics);
        
       const skills = extractSkills({ resume: resumeText, jd: jobDescription, mode, lexicon: skillsLexicon });
            setSkillsResults(skills);
    }
    return (
        <Box sx={{ p: 4 }}>
           <Typography variant='h4' gutterBottom>
            Resume Matcher
            </Typography>
            <JobDescriptionInput 
                value={jobDescription}
                onChange={setJobDescription}
                onExtract={handleExtract}
            />
            <ExtractorUI 
                resumeText={resumeText}
                setResumeText={setResumeText}
                onExtract={handleExtract}
            />
            {/* {heuristicsResults && (
                <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Heuristics Info</Typography>
                {Object.entries(heuristicsResults).map(([key, data]) => (
                    <Box key={key} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{key.toUpperCase()}</Typography>
                    <Typography variant="body1">{Array.isArray(data.value) ? data.value.map(v => v.value || v).join(", ") : data.value || "—"}</Typography>
                    <LinearProgress variant="determinate" value={Math.round((data.confidence || 0) * 100)} sx={{ height: 8, borderRadius: 1, mb: 1 }} />
                    <Typography variant="caption">{data.rule}</Typography>
                    </Box>
                ))}
                </Paper>
            )} */}

            {skillsResults && (
                <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Skills Match ({skillsResults.matchPercent}%)</Typography>
                <Grid container spacing={2}>
                    {skillsResults.results.map((skill, idx) => (
                    <Grid item key={idx} xs={12} sm={6} md={4}>
                        <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">{skill.name}</Typography>
                        <Typography variant="caption">{skill.source === "lexicon" ? "📘 Lexicon" : skill.source === "jd" ? "📝 JD" : "⚡ Auto"}</Typography>
                        <LinearProgress variant="determinate" value={Math.round(skill.match * 100)} sx={{ height: 8, borderRadius: 1, my: 1 }} />
                        <Chip label={skill.category || "Other"} size="small" color="primary" />
                        </Paper>
                    </Grid>
                    ))}
                </Grid>
                </Paper>
            )}
        </Box>
    )
}