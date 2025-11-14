import React, {useState} from  'react '
import { extractResumeFields } from  '../utils/heuristics '

export default function ExtractorUI() {
    const [resumeText, setResumeText] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)

    const handleExtract = () => {
        setLoading(true)
        setTimeout(() => {
            const parsed = extractResumeFields(resumeText)
            setResults([parsed])
            setLoading(false)
        }, 500)
    }

    const handleReset = () => {
        setResumeText('')
        setResults(null)
    }

    return (
        <Box>
            <Typography variant= 'h4 ' gutterBottom>
                Resume Field Extractor
            </Typography>
            {!results && (
                <Paper sx={{ p: 3 }}>
                <Typography variant= 'body1 ' sx={{ mb: 2 }}>
                    Paste résumé text below and click <b>Extract Fields</b>.
                </Typography>

                <TextField
                    multiline
                    minRows={10}
                    fullWidth
                    label= 'Paste Résumé Here '
                    variant= 'outlined '
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                    variant= 'contained '
                    onClick={handleExtract}
                    disabled={!resumeText || loading}
                    >
                    {loading ? <CircularProgress size={24} /> : 'Extract Fields'}
                    </Button>

                    <Button variant= 'outlined ' onClick={handleReset}>
                    Reset
                    </Button>
                </Box>
                </Paper>
            )}

            {results && (
                <ResultViewer results={results} onBack={handleReset} />
            )}
        </Box>
    )
}
