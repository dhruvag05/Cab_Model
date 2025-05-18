"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnalysisResults } from "@/components/analysis-results"
import { toast } from "@/hooks/use-toast"

export function AudioAnalyzer() {
  const [showResults, setShowResults] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive",
      })
      return
    }
    setAudioFile(file)
  }

  const handleAnalyze = async () => {
    if (!audioFile) {
      toast({
        title: "Missing file",
        description: "Please upload an audio file",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const formData = new FormData()
      formData.append('audio', audioFile)

      const response = await fetch('/api/analyze-audio', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResults(data)
      setShowResults(true)
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing the audio file",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p className="text-sm text-muted-foreground">
              Audio: {audioFile?.name} ({(audioFile?.size / (1024 * 1024)).toFixed(1)} MB)
            </p>
          </div>
          <Button onClick={() => {
            setShowResults(false)
            setAudioFile(null)
            setResults(null)
          }} variant="outline">
            Analyze Another Recording
          </Button>
        </div>

        <AnalysisResults results={results} />
      </div>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>

            <div className="flex flex-col space-y-2 text-center">
              <h3 className="text-lg font-semibold">Upload Audio Recording</h3>
              <p className="text-sm text-muted-foreground">Upload your audio recording to analyze buyer requirements</p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="audio-upload"
                  disabled={loading}
                />
                <label htmlFor="audio-upload" className="flex-1">
                  <Button variant="secondary" className="w-full cursor-pointer" asChild disabled={loading}>
                    <span>{audioFile ? audioFile.name : "Select Audio File"}</span>
                  </Button>
                </label>
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={!audioFile || loading}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Recording"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}