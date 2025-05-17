"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnalysisResults } from "@/components/analysis-results"
import { getMockAnalysisData } from "@/lib/analyze-audio"
import { toast } from "@/hooks/use-toast"

export function AudioAnalyzer() {
  const [showResults, setShowResults] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [excelFile, setExcelFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'excel') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'audio') {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file",
          variant: "destructive",
        })
        return
      }
      setAudioFile(file)
    } else {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive",
        })
        return
      }
      setExcelFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!audioFile || !excelFile) {
      toast({
        title: "Missing files",
        description: "Please upload both audio and Excel files",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, you would send both files to the backend
    // For now, we'll just show the mock results
    setShowResults(true)
  }

  if (showResults) {
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
            setExcelFile(null)
          }} variant="outline">
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
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <p className="text-sm text-muted-foreground">Upload your audio recording and projects Excel file</p>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'audio')}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload" className="flex-1">
                  <Button variant="secondary" className="w-full cursor-pointer" asChild>
                    <span>{audioFile ? audioFile.name : "Select Audio File"}</span>
                  </Button>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleFileChange(e, 'excel')}
                  className="hidden"
                  id="excel-upload"
                />
                <label htmlFor="excel-upload" className="flex-1">
                  <Button variant="secondary" className="w-full cursor-pointer" asChild>
                    <span>{excelFile ? excelFile.name : "Select Excel File"}</span>
                  </Button>
                </label>
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={!audioFile || !excelFile}
                className="w-full"
              >
                Analyze Files
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}