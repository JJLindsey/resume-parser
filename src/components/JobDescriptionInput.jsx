import { useState } from "react"
import { Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export default function JobDescriptionInput({value, onChange, onExtract, disabled}) {
    //const [mode, setMode] = useState('hybrid')
    return (
            <Paper sx={{ p: 3, mb: 4 }}>
                <TextField
                    multiline
                    minRows={5}
                    fullWidth
                    placeholder="Paste job description here..."
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                />
                 <Button variant='contained' onClick={onExtract} disabled={!value || disabled} sx={{ mt: 2 }}>
                    Analyze Job Description
                </Button>
            </Paper>
    )
}