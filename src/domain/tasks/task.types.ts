export type TaskStatus = 'open' | 'completed'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  dealId: string
  title: string
  assignee: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
}
