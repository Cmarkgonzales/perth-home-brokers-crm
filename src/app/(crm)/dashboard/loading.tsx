import { Card, CardContent } from '@/components/ui/card'

function MetricSkeleton () {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="h-0.5 w-8 animate-pulse rounded-full bg-surface-strong" />
        <div className="h-3 w-20 animate-pulse rounded bg-surface-strong" />
        <div className="h-8 w-16 animate-pulse rounded bg-surface-strong" />
      </CardContent>
    </Card>
  )
}

export default function DashboardLoading () {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-strong" />
        <div className="h-4 w-80 animate-pulse rounded bg-surface-strong" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded bg-surface-strong"
              />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded bg-surface-strong"
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
