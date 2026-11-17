import { Card, CardContent } from '@/components/ui/card'

function MoneySkeleton () {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
      <div className="h-2.5 w-16 animate-pulse rounded bg-surface-strong" />
      <div className="mt-2 h-5 w-12 animate-pulse rounded bg-surface-strong" />
      <div className="mt-1.5 h-2.5 w-20 animate-pulse rounded bg-surface-strong" />
    </div>
  )
}

export default function DashboardLoading () {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-surface-strong" />
          <div className="h-4 w-40 animate-pulse rounded bg-surface-strong" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-lg bg-surface-strong" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
        <div className="order-2 space-y-4 lg:order-1">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MoneySkeleton />
            <MoneySkeleton />
            <MoneySkeleton />
            <MoneySkeleton />
          </div>
          <Card>
            <CardContent className="space-y-3 p-6">
              <div className="h-4 w-32 animate-pulse rounded bg-surface-strong" />
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded bg-surface-strong"
                />
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="h-48 animate-pulse bg-surface-strong" />
            <Card className="h-48 animate-pulse bg-surface-strong" />
          </div>
        </div>
        <div className="order-1 space-y-4 lg:order-2">
          <Card className="h-44 animate-pulse bg-surface-strong" />
          <Card className="h-80 animate-pulse bg-surface-strong" />
        </div>
      </div>
    </div>
  )
}