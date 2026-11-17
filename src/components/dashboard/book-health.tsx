import Link from 'next/link'
import type {
  BrokerWorkloadRow,
  DashboardBookHealth,
} from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'
import { ConsultantAvatar } from '@/components/commissions/consultant-avatar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SettlementVolumeChart } from '@/components/dashboard/settlement-volume-chart'
import { Progress } from '@/components/ui/progress'

interface BookHealthProps {
  book: DashboardBookHealth
  brokers: BrokerWorkloadRow[]
}

function buildConicGradient (
  slices: DashboardBookHealth['donutSlices']
): string {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0) || 1
  let accumulated = 0
  const stops = slices.map((slice) => {
    const start = (accumulated / total) * 100
    accumulated += slice.count
    const end = (accumulated / total) * 100
    return `${slice.color} ${start}% ${end}%`
  })
  return `conic-gradient(${stops.join(', ')})`
}

export function BookHealth ({ book, brokers }: BookHealthProps) {
  const donutBackground =
    book.donutSlices.length > 0
      ? buildConicGradient(book.donutSlices)
      : 'conic-gradient(#E5E5E3 0% 100%)'

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-text-primary">
            Book health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-text-tertiary">Active</dt>
              <dd className="text-lg font-semibold tabular-nums text-text-primary">
                {book.counts.activeDeals}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">In finance</dt>
              <dd className="text-lg font-semibold tabular-nums text-text-primary">
                {book.counts.inFinance}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Package</dt>
              <dd className="text-lg font-semibold tabular-nums text-text-primary">
                {book.counts.inPackage}
              </dd>
            </div>
            <div>
              <dt className="text-text-tertiary">Build</dt>
              <dd className="text-lg font-semibold tabular-nums text-text-primary">
                {book.counts.inBuild}
              </dd>
            </div>
          </dl>

          <div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-text-secondary">
                Past finance
              </span>
              <span className="text-text-tertiary">{book.pastFinanceLabel}</span>
            </div>
            <Progress
              value={book.pastFinancePercent}
              className="mt-2 h-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-surface-strong"
            />
          </div>

          <div className="flex items-center gap-4">
            <div
              className="relative size-24 shrink-0 rounded-full"
              style={{ background: donutBackground }}
              role="img"
              aria-label={`${book.donutTotal} deals across pipeline stages`}
            >
              <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-surface text-center">
                <span className="text-lg font-semibold tabular-nums text-text-primary">
                  {book.donutTotal}
                </span>
                <span className="text-[10px] text-text-tertiary">deals</span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
              {book.donutSlices.map((slice) => (
                <li
                  key={slice.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="inline-flex min-w-0 items-center gap-2 text-text-secondary">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                      aria-hidden
                    />
                    {slice.label}
                  </span>
                  <span className="font-medium tabular-nums text-text-primary">
                    {slice.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {book.delayedCount > 0 ? (
            <Link
              href="/deals?risk=1"
              className={cn(
                'flex items-center justify-between rounded-lg border border-warning/30',
                'bg-warning/5 px-3 py-2 text-sm transition-colors hover:bg-warning/10'
              )}
            >
              <span className="text-text-secondary">Delayed</span>
              <span className="font-semibold text-warning tabular-nums">
                {book.delayedCount}
              </span>
            </Link>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-text-primary">
            Settlement volume
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-4 sm:px-5">
          <SettlementVolumeChart data={book.monthlySettlements} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-text-primary">
            Brokers on the book
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {brokers.map((broker) => (
              <li
                key={broker.owner}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <ConsultantAvatar name={broker.owner} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {broker.owner}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {broker.openFiles}{' '}
                    {broker.openFiles === 1 ? 'open file' : 'open files'} · Next{' '}
                    {broker.nextDueLabel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}