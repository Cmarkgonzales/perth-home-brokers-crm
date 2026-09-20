import Link from 'next/link'
import type { DashboardMetric } from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { MetricSparkline } from '@/components/dashboard/metric-sparkline'

interface DashboardMetricCardProps {
  metric: DashboardMetric
}

export function DashboardMetricCard ({ metric }: DashboardMetricCardProps) {
  const hintDescription = metric.hintPeriod
    ? `${metric.hint} ${metric.hintPeriod}`
    : metric.hint

  return (
    <Link
      href={metric.href}
      aria-label={`${metric.label}: ${metric.value}, ${hintDescription}`}
      className="block rounded-[12px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card
        className={cn(
          'h-full gap-0 py-5 transition-colors hover:bg-table-hover',
          metric.highlighted && 'border-phb-yellow'
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5">
          <p className="text-sm text-text-secondary">{metric.label}</p>
          <MetricSparkline
            data={metric.trend}
            className="text-info/80"
          />
        </div>
        <div className="mt-3 px-5">
          <p className="text-[28px] leading-none font-semibold tracking-tight text-text-primary tabular-nums sm:text-[32px]">
            {metric.value}
          </p>
          <p className="mt-2 text-[13px] font-medium">
            <span
              className={cn(
                metric.hintTone === 'positive' && 'text-success',
                metric.hintTone === 'warning' && 'text-text-secondary',
                metric.hintTone === 'neutral' && 'text-text-tertiary'
              )}
            >
              {metric.hint}
            </span>
            {metric.hintPeriod ? (
              <span className="text-text-tertiary"> {metric.hintPeriod}</span>
            ) : null}
          </p>
        </div>
      </Card>
    </Link>
  )
}
