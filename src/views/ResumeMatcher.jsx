import { useState } from "react"
import ExtractorUI from "../components/ExtractorUI"
import JobDescriptionInput from "../components/JobDescriptionInput"
import { extractResumeFields } from "../utils/heuristics"
import { extractSkills } from "../utils/extractSkills"
import skillsLexicon from '../data/skills.json' with {type: 'json'}
import SkillsResults from "../components/SkillsResults"

import { Box, Paper, Typography, LinearProgress, Chip, Grid, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import ResultViewer from "../components/ResultViewer"

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
        return heuristics;
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
                            Job description analyzed! Now paste your resume below to see the match.
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