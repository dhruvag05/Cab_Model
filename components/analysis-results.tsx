"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Users, BarChart3, FileText, Lightbulb, Home } from "lucide-react"
import { SentimentChart } from "@/components/sentiment-chart"
import { ProjectAnalysis } from "@/components/project-analysis"
import { BuyerRequirements } from "@/components/buyer-requirements"

interface AnalysisResultsProps {
  results: {
    svAgent: {
      name: string
      metrics: {
        talkTime: number
        interruptions: number
        questions: number
      }
    }
    buyer: {
      name: string
      metrics: {
        talkTime: number
        questions: number
      }
      requirements: {
        budget: string
        location: string
        size: string
        features: string[]
        preferences: string[]
      }
    }
    sentiment: {
      overall: number
      timeline: Array<{
        time: string
        score: number
        speaker: string
      }>
      keywords: {
        positive: string[]
        negative: string[]
      }
    }
    improvements: string[]
    details: {
      duration: string
      transcription: string
    }
  }
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getSentimentLabel = (score: number) => {
    if (score >= 80) return { label: "Very Positive", color: "bg-green-500" }
    if (score >= 60) return { label: "Positive", color: "bg-green-400" }
    if (score >= 40) return { label: "Neutral", color: "bg-yellow-400" }
    if (score >= 20) return { label: "Negative", color: "bg-red-400" }
    return { label: "Very Negative", color: "bg-red-500" }
  }

  const sentimentInfo = getSentimentLabel(results.sentiment.overall)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-7 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="requirements">Requirements</TabsTrigger>
        <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        <TabsTrigger value="improvements">Improvements</TabsTrigger>
        <TabsTrigger value="transcription">Transcription</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                SV Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">{results.svAgent.name}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Talk Time:</span>
                  <span>{results.svAgent.metrics.talkTime}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interruptions:</span>
                  <span>{results.svAgent.metrics.interruptions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions Asked:</span>
                  <span>{results.svAgent.metrics.questions}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Buyer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">{results.buyer.name}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Talk Time:</span>
                  <span>{results.buyer.metrics.talkTime}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions Asked:</span>
                  <span>{results.buyer.metrics.questions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Sentiment Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Overall Sentiment</div>
                  <div className="text-2xl font-bold">{sentimentInfo.label}</div>
                </div>
                <Badge className={sentimentInfo.color}>{results.sentiment.overall}%</Badge>
              </div>
              <Progress value={results.sentiment.overall} className="h-2 mb-6" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Positive Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {results.sentiment.keywords.positive.map((keyword, i) => (
                      <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Negative Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {results.sentiment.keywords.negative.map((keyword, i) => (
                      <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Call Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between py-1">
                  <span className="font-medium">Duration:</span>
                  <span>{results.details.duration}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-1">
                  <span className="font-medium">Top Improvement:</span>
                  <span>{results.improvements[0]}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="requirements">
        <BuyerRequirements requirements={results.buyer.requirements} />
      </TabsContent>

      <TabsContent value="sentiment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Sentiment timeline throughout the conversation</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <SentimentChart data={results.sentiment.timeline} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Positive Keywords</CardTitle>
              <CardDescription>Words and phrases that contributed to positive sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.sentiment.keywords.positive.map((keyword, i) => (
                  <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Negative Keywords</CardTitle>
              <CardDescription>Words and phrases that contributed to negative sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.sentiment.keywords.negative.map((keyword, i) => (
                  <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="improvements" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Improvement Suggestions
            </CardTitle>
            <CardDescription>Actionable insights to improve future calls</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {results.improvements.map((improvement, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="text-sm">{improvement}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="transcription">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Conversation Transcription
            </CardTitle>
            <CardDescription>Full transcript of the recorded conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <div className="whitespace-pre-wrap text-sm">{results.details.transcription}</div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="projects">
        <ProjectAnalysis 
          transcript={results.details.transcription}
        />
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>Technical information about the audio recording</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Duration:</span>
                <span>{results.details.duration}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">File Size:</span>
                <span>4.2 MB</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Sample Rate:</span>
                <span>44.1 kHz</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Channels:</span>
                <span>Stereo</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Format:</span>
                <span>MP3</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Bit Rate:</span>
                <span>128 kbps</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Processing Time:</span>
                <span>12.3 seconds</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium">AI Model:</span>
                <span>MagicAnalyzer v2.1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}