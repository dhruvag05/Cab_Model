export interface Project {
  id: string
  name: string
  category: 'paid' | 'clone'
  description?: string
}