import { useState } from "react"
import ExtractorUI from "../components/ExtractorUI"
import JobDescriptionInput from "../components/JobDescriptionInput"
import { extractResumeFields } from "../utils/heuristics"
import { extractSkills } from "../utils/extractSkills"
import skillsLexicon from '../data/skills.json' with {type: 'json'}
import SkillsResults from "../components/SkillsResults"

import { Box, Paper, Typography, LinearProgress, Chip, Grid, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export default function ResumeMatcher() {
    const [jobDescription, setJobDescription] = useState('')
    const [jdAnalyzed, setJdAnalyzed] = useState(false)
    const [resumeText, setResumeText] = useState('')
    const [skillsResults, setSkillsResults] = useState(null)
    const [mode, setMode] = useState('Hybrid')
    const [heuristicsResults, setHeuristicsResults] = useState(null)
    //const [loading, setLoading] = useState(false)

    const handleAnalyzeJD = () => {
        setJdAnalyzed(true)
        setSkillsResults(null)
        setHeuristicsResults(null)
    }
    // For Lexicon only mode, allow skipping JD step
    const canProceedToResume = mode === "Lexicon only" || jdAnalyzed

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

    const handleReset = () => {
        setJobDescription('')
        setJdAnalyzed(false)
        setResumeText('')
        setSkillsResults(null)
        setHeuristicsResults(null)
    }

    return (
        <Box sx={{ p: 4 }}>
           <Typography variant='h4' gutterBottom>
            Resume Matcher
            </Typography>
            <Paper>
                <Typography variant='body1' sx={{ p: 2 }}>
                    Select Analysis Mode
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="mode-select-label">Analysis Mode</InputLabel>
                    <Select
                        labelId="mode-select-label"
                        value={mode}
                        label="Analysis Mode"
                        onChange={(e) => {
                            setMode(e.target.value)
                            setJdAnalyzed(false)
                            setSkillsResults(null)
                            setHeuristicsResults(null)
                        }}
                    >
                        <MenuItem value="JD only">Job Description Only</MenuItem>
                        <MenuItem value="Lexicon only">Skills Match Only</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    {mode === "JD only" && "Only skills from the job description will be analyzed"}
                    {mode === "Lexicon only" && "Skills will be matched against a predefined skills database (no JD needed)"}
                    {mode === "Hybrid" && "Skills from both job description and skills database will be analyzed"}
                </Typography>
            </Paper>
              {mode !== "Lexicon only" && (
                <>
                    <JobDescriptionInput 
                        value={jobDescription}
                        onChange={(val) => {
                            setJobDescription(val)
                            setJdAnalyzed(false) // Reset analyzed state when JD changes
                        }}
                        onExtract={handleAnalyzeJD}
                        disabled={false}
                    />

                    {/* Success feedback after JD analysis */}
                    {jdAnalyzed && !skillsResults && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            ✓ Job description analyzed! Now paste your resume below to see the match.
                        </Alert>
                    )}
                </>
            )}
            {mode === "Lexicon only" && !skillsResults && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    📘 Lexicon Mode: Skills will be matched against the predefined skills database. Paste your resume below to continue.
                </Alert>
            )}
            {canProceedToResume && (
            <ExtractorUI 
                resumeText={resumeText}
                setResumeText={setResumeText}
                onExtract={handleExtract}
                onReset={handleReset}
                disabled={!resumeText}
            />
            )}

            {/* {skillsResults && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Skills Analysis
                    </Typography>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                            label={`Total Found: ${skillsResults.stats.total}`} 
                            color="primary" 
                            variant="outlined"
                        />
                        <Chip 
                            label={`✓ In Both: ${skillsResults.stats.inBoth}`} 
                            color="success"
                        />
                        <Chip 
                            label={`📘 Resume Only: ${skillsResults.stats.inResumeOnly}`} 
                            color="info"
                        />
                        <Chip 
                            label={`📝 JD Only: ${skillsResults.stats.inJDOnly}`} 
                            color="warning"
                        />
                    </Box>

                    {skillsResults.stats.inJDOnly + skillsResults.stats.inBoth > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" gutterBottom>
                                Job Description Match: {skillsResults.matchPercent}%
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={skillsResults.matchPercent} 
                                sx={{ height: 10, borderRadius: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {skillsResults.stats.inBoth} of {skillsResults.stats.inJDOnly + skillsResults.stats.inBoth} JD skills found in resume
                            </Typography>
                        </Box>
                    )}
                    <Grid container spacing={2}>
                        {skillsResults.results.map((skill, idx) => (
                            <Grid item key={idx} xs={12} sm={6} md={4}>
                                <Paper 
                                    sx={{ 
                                        p: 2,
                                        border: skill.inJD && skill.inResume ? '2px solid' : '1px solid',
                                        borderColor: skill.inJD && skill.inResume ? 'success.main' : 'divider'
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={skill.inJD && skill.inResume ? 600 : 400}>
                                        {skill.skill}
                                    </Typography>
                                    <Typography variant="caption">
                                        {skill.inResume && skill.inJD ? "✓ In Both" : 
                                         skill.inResume ? "📘 Resume" : "📝 JD Only"}
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={Math.round(skill.match * 100)} 
                                        sx={{ height: 8, borderRadius: 1, my: 1 }} 
                                        color={skill.inJD && skill.inResume ? "success" : "primary"}
                                    />
                                    <Chip label={skill.category || "Other"} size="small" color="primary" />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )} */}
             {skillsResults && (
                <SkillsResults 
                    skillsResults={skillsResults}
                    mode={mode}
                    lexiconLength={skillsLexicon.length}
                />
            )}

            {/* No skills found message */}
            {skillsResults && skillsResults.results && skillsResults.results.length === 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    No matching skills found. Try a different mode or check that your resume contains skills from the lexicon.
                </Alert>
            )}
        </Box>
    )
}