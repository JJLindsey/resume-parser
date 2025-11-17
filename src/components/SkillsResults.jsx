import React from 'react'
import { Paper, Typography, LinearProgress, Chip, Grid, Box } from '@mui/material'

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

            {/* Match Percentage - Different display based on mode */}
            {mode !== "Lexicon only" && skillsResults.stats.inJDOnly + skillsResults.stats.inBoth > 0 && (
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

            {/* Skills Grid */}
            {/* <Grid container spacing={2}>
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
            </Grid> */}
            <Grid container spacing={2}>
    {skillsResults.results.map((skill, idx) => (
        <Grid item key={idx} xs={12} sm={6} md={4}>
            <Paper 
                sx={{ 
                    p: 2,
                    border: skill.inJD && skill.inResume ? '2px solid' : '1px solid',
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
                        <Typography variant="caption" color="text.secondary">
                            {skill.category}
                        </Typography>
                    </Box>
                    
                    <Chip 
                        label={skill.inResume && skill.inJD ? "Match" : 
                               skill.inResume ? "Resume" : "Missing"}
                        size="small"
                        color={skill.inJD && skill.inResume ? "success" : 
                               skill.inResume ? "info" : "warning"}
                    />
                </Box>
            </Paper>
        </Grid>
    ))}
</Grid>
        </Paper>
    )
}