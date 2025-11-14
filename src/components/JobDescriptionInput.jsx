import { useState } from "react"
import { Paper, TextField, Button } from "@mui/material"

export default function JobDescriptionInput({value, onChange, onExtract}) {

    return (
        <>
            <Paper sx={{ p: 3, mb: 4 }}>
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