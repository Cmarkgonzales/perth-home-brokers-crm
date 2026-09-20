import { Card, CardContent } from '@/components/ui/card'

function MetricSkeleton () {
  return (
    <Card className="gap-0 py-5">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-strong" />
          <div className="h-8 w-16 animate-pulse rounded bg-surface-strong" />
        </div>
        <div className="h-8 w-16 animate-pulse rounded bg-surface-strong" />
        <div className="h-3 w-12 animate-pulse rounded bg-surface-strong" />
      </CardContent>
    </Card>
  )
}

export default function DashboardLoading () {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-surface-strong" />
          <div className="h-4 w-72 animate-pulse rounded bg-surface-strong" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-lg bg-surface-strong" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)]">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="h-4 w-32 animate-pulse rounded bg-surface-strong" />
            <div className="flex h-40 items-end gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 flex-1 animate-pulse rounded-t-lg bg-surface-strong"
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="h-64 animate-pulse rounded-[12px] bg-surface-strong" />
      </div>

      <Card>
        <CardContent className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded bg-surface-strong"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
