import React from 'react'
import { Box, Paper, Typography, TextField, Button, LinearProgress } from '@mui/material'

export default function ResultViewer({ results, onBack }) {
    if (!results || Object.keys(results).length === 0) {
        return (
            <Box>
                <Typography variant='h6'>
                    No results to display.
                </Typography>
                <Button variant='outlined' onClick={onReset}>
                    Back to Input
                </Button>
            </Box>
        )
    }
    return (
        <Box sx={{ mt: 4 }}>
                <Typography variant='h5' gutterBottom>
                    Extracted Fields
                </Typography>

                {Object.entries(results).map(([key, data]) => (
                    <Paper key={key} sx={{ p: 2, mb: 2 }}>
                    <Typography variant='subtitle1'>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>

                    <Typography variant='body1' sx={{ mb: 1 }}>
                        {Array.isArray(data.value) && data.value.length > 0
                        ? data.value
                            .map((item) => {
                                // if item is object, format based on common fields
                                if (typeof item === "object" && item !== null) {
                                if (item.degree && item.school) {
                                    return `${item.degree} in ${item.field || "—"} — ${item.school}`;
                                } else if (item.name) {
                                    return item.name; // skills
                                } else if (item.title && item.company) {
                                    return `${item.title} @ ${item.company} (${item.years || "—"})`;
                                } else {
                                    return JSON.stringify(item); // fallback
                                }
                                }
                                return item; // if already string
                            })
                            .join(", ")
                        : data.value || "—"}
                    </Typography>

                    <LinearProgress
                        variant='determinate'
                        value={Math.round(data.confidence * 100)}
                        sx={{ height: 8, borderRadius: 1, mb: 1 }}
                    />
                    <Typography variant='caption'>
                        Confidence: {(data.confidence * 100).toFixed(0)}% — Rule: {data.rule}
                    </Typography>
                    </Paper>
                ))}
            <Button variant='outlined' onClick={onBack}>
            Back to Input
            </Button>
        </Box>  
    )
}