'use client'

import { useState } from 'react'
import type { Activity } from '@/domain/activities/activity.types'
import type { TimelineFilter } from '@/domain/activities/activity.types'
import { formatMonthDay } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const FILTER_OPTIONS: { value: TimelineFilter | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'finance', label: 'Finance' },
  { value: 'admin', label: 'Admin' },
  { value: 'builder', label: 'Builder' },
  { value: 'client', label: 'Client' },
  { value: 'ai', label: 'AI' },
]

const CATEGORY_BADGE_CLASS: Record<TimelineFilter, string> = {
  finance: 'bg-info/10 text-info',
  admin: 'bg-surface-strong text-text-secondary',
  builder: 'bg-warning/10 text-warning',
  client: 'bg-success/10 text-success',
  ai: 'bg-phb-yellow/25 text-text-primary',
}

interface DealTimelineProps {
  activities: Activity[]
  showFilters?: boolean
  title?: string
}

export function DealTimeline ({
  activities,
  showFilters = true,
  title = 'Deal timeline',
}: DealTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilter | 'all'>('all')

  const filtered = (
    filter === 'all'
      ? activities
      : activities.filter((activity) => activity.category === filter)
  )
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {showFilters ? (
          <CardAction className="max-w-full">
            <div className="flex flex-wrap justify-end gap-1 rounded-lg bg-surface-muted p-1">
              {FILTER_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="xs"
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    'rounded-md text-text-secondary hover:text-text-primary',
                    filter === option.value &&
                      'bg-surface font-medium text-text-primary'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activities match this filter.
          </p>
        ) : (
          <ol>
            {filtered.map((activity, index) => (
              <li
                key={activity.id}
                className="grid grid-cols-[3.5rem_0.875rem_minmax(0,1fr)] gap-x-3 pb-6 last:pb-0"
              >
                <div className="pt-0.5 text-right">
                  {activity.isToday ? (
                    <Badge className="bg-phb-yellow text-text-primary hover:bg-phb-yellow">
                      Today
                    </Badge>
                  ) : (
                    <p className="text-xs text-text-tertiary">
                      {formatMonthDay(activity.date)}
                    </p>
                  )}
                </div>
                <div className="relative flex justify-center">
                  {index < filtered.length - 1 ? (
                    <div
                      className="absolute top-4 bottom-[-24px] w-px bg-border"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className={cn(
                      'relative z-10 mt-1.5 size-3.5 rounded-full border-2',
                      activity.isToday
                        ? 'border-text-primary bg-text-primary'
                        : 'border-phb-yellow bg-phb-yellow'
                    )}
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">
                      {activity.title}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'capitalize',
                        CATEGORY_BADGE_CLASS[activity.category]
                      )}
                    >
                      {activity.category === 'ai'
                        ? 'AI'
                        : activity.category.charAt(0).toUpperCase() +
                          activity.category.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {activity.description}
                  </p>
                  {activity.actor ? (
                    <p className="text-xs text-text-tertiary">{activity.actor}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
