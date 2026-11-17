import Link from 'next/link'
import type { DashboardMoneyMetric } from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'

interface MoneyStripProps {
  metrics: DashboardMoneyMetric[]
  /** Denser tiles for the hero row beside AI briefing */
  compact?: boolean
}

export function MoneyStrip ({ metrics, compact = false }: MoneyStripProps) {
  return (
    <div
      className={cn(
        'grid gap-2',
        compact
          ? 'grid-cols-2 sm:grid-cols-4'
          : 'gap-4 sm:grid-cols-2 xl:grid-cols-4'
      )}
    >
      {metrics.map((metric) => {
        const hintDescription = [metric.secondaryValue, metric.hint]
          .filter(Boolean)
          .join(' · ')

        return (
          <Link
            key={metric.id}
            href={metric.href}
            aria-label={`${metric.label}: ${metric.primaryValue}${hintDescription ? `, ${hintDescription}` : ''}`}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div
              className={cn(
                'h-full rounded-lg border border-border bg-surface transition-colors hover:bg-table-hover',
                compact ? 'px-3 py-2.5' : 'px-4 py-4',
                metric.warning && 'border-warning/40'
              )}
            >
              <p
                className={cn(
                  'font-medium tracking-wide text-text-tertiary uppercase',
                  compact ? 'text-[10px] leading-tight' : 'text-xs'
                )}
              >
                {metric.label}
              </p>
              <div
                className={cn(
                  'mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0',
                  compact ? 'min-h-[1.75rem]' : 'mt-1.5'
                )}
              >
                <span
                  className={cn(
                    'font-semibold tabular-nums text-text-primary',
                    compact
                      ? 'text-lg leading-none sm:text-xl'
                      : 'text-2xl leading-none sm:text-[28px]'
                  )}
                >
                  {metric.primaryValue}
                </span>
                {!compact && metric.secondaryValue ? (
                  <span className="text-sm font-medium tabular-nums text-text-secondary">
                    {metric.secondaryValue}
                  </span>
                ) : null}
              </div>
              {compact && hintDescription ? (
                <p
                  className={cn(
                    'mt-1 text-[11px] leading-snug',
                    metric.warning ? 'text-warning' : 'text-text-tertiary'
                  )}
                >
                  {hintDescription}
                </p>
              ) : null}
              {!compact && metric.hint ? (
                <p
                  className={cn(
                    'mt-1.5 text-[13px] font-medium',
                    metric.warning ? 'text-warning' : 'text-text-tertiary'
                  )}
                >
                  {metric.hint}
                </p>
              ) : null}
            </div>
          </Link>
        )
      })}
    </div>
  )
}