import { type Project } from '@/types/projects'

// Generate variants of a project name
function generateVariants(projectName: string): string[] {
  const variants = new Set<string>()
  
  // Add original name
  variants.add(projectName.toLowerCase())
  
  // Remove spaces
  variants.add(projectName.toLowerCase().replace(/\s+/g, ''))
  
  // Add with different separators
  variants.add(projectName.toLowerCase().replace(/\s+/g, '-'))
  variants.add(projectName.toLowerCase().replace(/\s+/g, '_'))
  
  // Add common prefixes/suffixes
  variants.add(`${projectName.toLowerCase()} clone`)
  variants.add(`${projectName.toLowerCase()} app`)
  variants.add(`${projectName.toLowerCase()} application`)
  
  return Array.from(variants)
}

export function analyzeProjectMentions(transcript: string, projects: Project[]): Map<string, boolean> {
  const results = new Map<string, boolean>()
  const transcriptLower = transcript.toLowerCase()
  
  for (const project of projects) {
    const variants = generateVariants(project.name)
    const mentioned = variants.some(variant => transcriptLower.includes(variant))
    results.set(project.name, mentioned)
  }
  
  return results
}