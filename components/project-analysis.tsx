"use client"

import { useState } from 'react'
import { analyzeProjectMentions } from '@/lib/analyze-projects'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ProjectImport } from '@/components/project-import'
import { Project } from '@/types/projects'

interface ProjectAnalysisProps {
  transcript: string
}

export function ProjectAnalysis({ transcript }: ProjectAnalysisProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const cloneProjects = projects.filter(p => p.category === 'clone')
  const analysisResults = analyzeProjectMentions(transcript, cloneProjects)
  
  const handleImport = (importedProjects: Project[]) => {
    setProjects(importedProjects)
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clone Projects Analysis</CardTitle>
        <ProjectImport onImport={handleImport} />
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Import your projects Excel file to start analysis
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {cloneProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between">
                  <span className="font-medium">{project.name}</span>
                  <Badge variant={analysisResults.get(project.name) ? "default" : "secondary"}>
                    {analysisResults.get(project.name) ? "Mentioned" : "Not Mentioned"}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}