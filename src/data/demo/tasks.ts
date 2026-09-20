import type { Task } from '@/domain/tasks/task.types'

export const demoTasks: Task[] = [
  {
    id: 'task-001',
    dealId: 'PHB-2026-00142',
    title: 'Request bank statement from Williams',
    assignee: 'James',
    dueDate: '2026-03-20',
    status: 'open',
    priority: 'high',
  },
  {
    id: 'task-002',
    dealId: 'PHB-2026-00142',
    title: 'Follow up with lender on pre-approval',
    assignee: 'James',
    dueDate: '2026-03-22',
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'task-003',
    dealId: 'PHB-2026-00138',
    title: 'Review builder quote with Michael Chen',
    assignee: 'Arvin',
    dueDate: '2026-03-16',
    status: 'open',
    priority: 'high',
  },
  {
    id: 'task-004',
    dealId: 'PHB-2026-00151',
    title: 'Schedule initial consultation',
    assignee: 'Jay',
    dueDate: '2026-03-07',
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'task-005',
    dealId: 'PHB-2026-00140',
    title: 'Book site inspection',
    assignee: 'Sarah',
    dueDate: '2026-03-24',
    status: 'open',
    priority: 'low',
  },
]
