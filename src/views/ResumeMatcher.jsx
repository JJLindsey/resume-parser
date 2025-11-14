import ExtractorUI from "../components/ExtractorUI"
import { extractResumeFields } from "../utils/heuristics"

export default function ResumeMatcher() {
    const [jobDescription, setJobDescription] = useState('')
    const [resumeText, setResumeText] = useState('')
    const [results, setResults] = useState(null)
    //const [loading, setLoading] = useState(false)

    const handleExtract = () => {
        const jdKeywords = jobDescription
            .toLowerCase()
            .split(/\W+/)
            .filter(w => w.length > 2)
        
        const parsed = extractResumeFields(resumeText, jdKeywords)
        setMatchingResults(parsed)
    }
    return (
        <>
            <JobDescritpionInput 
                value={jobDescription}
                onChange={setJobDescription}
            />
            <ExtractorUI 
                resumeText={resumeText}
                setResumeText={setResumeText}
                onExtract={handleExtract}
            />
            {results && (
                <ResultViewer results={results} onBack={() => setResults(null)} />
            )}
        </>
    )
}