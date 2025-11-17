import React from 'react'
import { Paper, Typography, LinearProgress, Chip, Grid, Box } from '@mui/material'
import { color } from '@mui/system'

const categoryColors = {
    "Programming Language": { bg: "#7ca1ffff", color: "#000" },
    "Frontend": { bg: "#ffcc00", color: "#000" },
    "Backend & API": { bg: "#00db2cff", color: "#000" },
    "Design & UX": { bg: "#ff8400ff", color: "#000" },
    "Database": { bg: "#d6a1ffff", color: "#000" },
    "Project & Product Management": { bg: "#ff59fcff", color: "#000" },
    "Soft Skill": { bg:"#00ffff", color: "#000" },
    "Cloud & DevOps": { bg: "#ff7b84ff", color: "#000" },
    "Other": { bg: "#808080ff", color: "#000" },
}

export default function SkillsResults({ skillsResults, mode, lexiconLength }) {
    if (!skillsResults || !skillsResults.results || skillsResults.results.length === 0) {
        return null
    }

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
                Skills Analysis
            </Typography>
            
            {/* Summary Stats */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                    label={`Total Found: ${skillsResults.stats.total}`} 
                    color="primary" 
                    variant="outlined"
                />
                <Chip 
                    label={`✓ Skills MatchIn: ${skillsResults.stats.inBoth}`} 
                    color="success"
                    variant="outlined"
                />
                <Chip 
                    label={`📘 Resume Only: ${skillsResults.stats.inResumeOnly}`} 
                    color="info"
                    variant="outlined"
                />
                <Chip 
                    label={`📝 Job Description Only: ${skillsResults.stats.inJDOnly}`} 
                    color="warning"
                    variant="outlined"
                />
            </Box>

            {/* Match Percentage - Different display based on mode */}
            {mode !== "Lexicon only" && skillsResults.stats.inJDOnly + skillsResults.stats.inBoth > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body" gutterBottom>
                        Job Description Match: {skillsResults.matchPercent}%
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={skillsResults.matchPercent} 
                        sx={{ height: 10, borderRadius: 1 }}
                    />
                    <Typography variant="body" color="text.secondary">
                        {skillsResults.stats.inBoth} of {skillsResults.stats.inJDOnly + skillsResults.stats.inBoth} Job Description skills found in resume
                    </Typography>
                </Box>
            )}

            {mode === "Lexicon only" && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                        Skills Coverage: {skillsResults.matchPercent}%
                    </Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={skillsResults.matchPercent} 
                        sx={{ height: 10, borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {skillsResults.stats.total} of {lexiconLength} lexicon skills found in resume
                    </Typography>
                </Box>
            )}
            <Grid container spacing={2}>
                {skillsResults.results.map((skill, idx) => (
                    <Grid item key={idx} xs={12} sm={6} md={4}>
                        <Paper 
                            sx={{ 
                                p: 2,
                                border: skill.inJD && skill.inResume ? '4px solid' : '1px solid',
                                borderColor: skill.inJD && skill.inResume ? 'success.main' : 
                                            skill.inResume ? 'info.main' : 
                                            'warning.main',
                                bgcolor: skill.inJD && skill.inResume ? 'success.50' : 'background.paper'
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={skill.inJD && skill.inResume ? 600 : 400}>
                                        {skill.skill}
                                    </Typography>
                                    {/* <Typography variant="caption" color="text.secondary">
                                        {skill.category}
                                    </Typography> */}
                                    <Box>
                                        <Chip 
                                            label={skill.category || "Other"} 
                                            size="small"
                                            sx={{
                                                backgroundColor: categoryColors[skill.category]?.bg || "grey.300",
                                                color: categoryColors[skill.category]?.text || "black",
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Box>
                                  <Typography variant="caption" color="text.secondary">
                                        {skill.inResume && skill.inJD ? "Match" : 
                                        skill.inResume ? "Resume" : "Missing"}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    )
}