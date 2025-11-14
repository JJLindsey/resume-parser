import { useState } from "react"
import { Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export default function JobDescriptionInput({value, onChange, onExtract}) {
    const [mode, setMode] = useState('hybrid')
    return (
        <>
            <Paper sx={{ p: 3, mb: 4 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="mode-select-label">Analysis Mode</InputLabel>
                    <Select
                        labelId="mode-select-label"
                        value={mode}
                        label="Analysis Mode"
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <MenuItem value="jd">Job Description Only</MenuItem>
                        <MenuItem value="lexicon">Skills Lexicon Only</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    multiline
                    minRows={5}
                    fullWidth
                    placeholder="Paste job description here..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
                 <Button variant='contained' onClick={onExtract} disabled={!value}>
                    Analyze Job Description
                </Button>
            </Paper>
        </>
    )
}