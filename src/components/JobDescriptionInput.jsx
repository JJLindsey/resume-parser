import { Paper, TextField } from "@mui/material"

export default function setJobDescription(){
    const [jobDescription, setJobDescription] = useState('')

    return (
        <>
            <Paper sx={{ p: 3, mb: 4 }}>
                <TextField
                    multiline
                    minRows={5}
                    fullWidth
                    placeholder="Paste job description here..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                />
            </Paper>
        </>
    )
}