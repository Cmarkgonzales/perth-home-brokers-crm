import type { Activity } from '@/domain/activities/activity.types'
import { formatDate } from '@/lib/formatting'
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
    <ul className={cn('space-y-4', className)}>
      {items.map((activity) => (
        <li
          key={activity.id}
          className="border-l-2 border-border-strong pl-4"
        >
          <p className="text-xs text-muted-foreground">
            {formatDate(activity.date)}
          </p>
          <p className="text-sm font-medium">{activity.title}</p>
          <p className="text-sm text-muted-foreground">
            {activity.description}
          </p>
        </li>
      ))}
    </ul>
  )
}
