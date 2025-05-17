import { Suspense } from "react"
import { AudioAnalyzer } from "@/components/audio-analyzer"
import { UploadFallback } from "@/components/upload-fallback"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Magic Analyzer</h1>
          <p className="text-muted-foreground">
            Upload call recordings to analyze buyer requirements and project recommendations
          </p>
        </header>

        <Suspense fallback={<UploadFallback />}>
          <AudioAnalyzer />
        </Suspense>
      </div>
    </main>
  )
}