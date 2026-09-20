'use client'

import { useState } from 'react'
import type { Activity } from '@/domain/activities/activity.types'
import type { TimelineFilter } from '@/domain/activities/activity.types'
import { formatDate } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const FILTER_OPTIONS: { value: TimelineFilter | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'finance', label: 'Finance' },
  { value: 'admin', label: 'Admin' },
  { value: 'builder', label: 'Builder' },
  { value: 'client', label: 'Client' },
  { value: 'ai', label: 'AI' },
]

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

  const filtered =
    filter === 'all'
      ? activities
      : activities.filter((activity) => activity.category === filter)

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {showFilters && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'secondary' : 'ghost'}
                size="xs"
                onClick={() => setFilter(option.value)}
                className={cn(
                  filter === option.value &&
                    'bg-surface-strong text-text-primary'
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activities match this filter.
          </p>
        ) : (
          <ul className="relative space-y-0">
            {filtered.map((activity, index) => (
              <li key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < filtered.length - 1 && (
                  <div
                    className="absolute left-[7px] top-4 h-full w-0.5 bg-border"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 mt-1.5">
                  <div
                    className={cn(
                      'size-4 rounded-full border-2 bg-surface',
                      activity.isToday
                        ? 'border-phb-yellow bg-phb-yellow'
                        : 'border-border-strong'
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-text-tertiary">
                      {formatDate(activity.date)}
                    </p>
                    {activity.isToday && (
                      <Badge className="bg-phb-yellow/20 text-text-primary hover:bg-phb-yellow/20">
                        TODAY
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      {activity.category}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    {activity.title}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {activity.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
