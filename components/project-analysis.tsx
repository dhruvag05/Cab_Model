"use client"

import { useState } from 'react'
import { analyzeProjectMentions } from '@/lib/analyze-projects'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProjectAnalysisProps {
  transcript: string
  projects: {
    name: string
    category: 'paid' | 'clone'
  }[]
}

export function ProjectAnalysis({ transcript, projects }: ProjectAnalysisProps) {
  const cloneProjects = projects.filter(p => p.category === 'clone')
  const analysisResults = analyzeProjectMentions(transcript, cloneProjects)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clone Projects Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {cloneProjects.map((project) => (
              <div key={project.name} className="flex items-center justify-between">
                <span className="font-medium">{project.name}</span>
                <Badge variant={analysisResults.get(project.name) ? "default" : "secondary"}>
                  {analysisResults.get(project.name) ? "Mentioned" : "Not Mentioned"}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}