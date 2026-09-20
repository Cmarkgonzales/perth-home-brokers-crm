import type { Activity } from '@/domain/activities/activity.types'
import { formatCompactDate } from '@/lib/formatting'
import { DEMO_TODAY } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  activities: Activity[]
  className?: string
  limit?: number
}

export function ActivityFeed ({
  activities,
  className,
  limit,
}: ActivityFeedProps) {
  const items = limit ? activities.slice(0, limit) : activities

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
    )
  }

  return (
    <ul className={cn('divide-y divide-border', className)}>
      {items.map((activity) => (
        <li key={activity.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-3 first:pt-0 last:pb-0">
          <p className="pt-0.5 text-sm text-text-tertiary">
            {formatCompactDate(activity.date, DEMO_TODAY)}
          </p>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">{activity.title}</p>
            <p className="mt-0.5 text-sm text-text-secondary">{activity.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
