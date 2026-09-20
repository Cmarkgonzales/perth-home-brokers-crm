'use client'

import { useState } from 'react'
import type { Task } from '@/domain/tasks/task.types'
import { daysBetween, formatMonthDay } from '@/lib/formatting'
import { DEMO_TODAY } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DealTasksPanelProps {
  tasks: Task[]
}

function formatTaskDue (dueDate: string): string {
  const delta = daysBetween(DEMO_TODAY, dueDate)

  if (delta === 0) return 'due Today'
  if (delta === 1) return 'due Tomorrow'
  if (delta === -1) return 'due Yesterday'
  return `due ${formatMonthDay(dueDate)}`
}

export function DealTasksPanel ({ tasks }: DealTasksPanelProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () =>
      new Set(
        tasks.filter((task) => task.status === 'completed').map((task) => task.id)
      )
  )

  function toggleTask (taskId: string) {
    setCompletedIds((current) => {
      const next = new Set(current)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-text-secondary">No tasks on this deal.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => {
              const completed = completedIds.has(task.id)

              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-start gap-2.5 text-left"
                    aria-pressed={completed}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                        completed
                          ? 'border-success bg-success text-surface'
                          : 'border-border-strong bg-surface'
                      )}
                      aria-hidden
                    >
                      {completed ? <Check className="size-2.5" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block text-sm font-medium text-text-primary',
                          completed && 'text-text-secondary line-through'
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-text-tertiary">
                        {task.assignee}, {formatTaskDue(task.dueDate)}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
