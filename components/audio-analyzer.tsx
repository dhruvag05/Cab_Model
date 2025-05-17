"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnalysisResults } from "@/components/analysis-results"
import { getMockAnalysisData } from "@/lib/analyze-audio"

export function AudioAnalyzer() {
  const [showResults, setShowResults] = useState(false)

  const handleSelectAudio = () => {
    // Skip actual file selection and analysis, go straight to results
    setShowResults(true)
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <p className="text-sm text-muted-foreground">File: sales_call_05172025.mp3 (4.2 MB)</p>
          </div>
          <Button onClick={() => setShowResults(false)} variant="outline">
            Analyze Another Recording
          </Button>
        </div>

        <AnalysisResults results={getMockAnalysisData()} />
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
              <h3 className="text-lg font-semibold">Upload audio recording</h3>
              <p className="text-sm text-muted-foreground">Drag and drop your audio file here or click to browse</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSelectAudio} variant="secondary">
                Select Audio File
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
