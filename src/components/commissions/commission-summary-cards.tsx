import type { CommissionSummary } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { MetricCard } from '@/components/dashboard/metric-card'

interface CommissionSummaryCardsProps {
  summary: CommissionSummary
}

export function CommissionSummaryCards ({ summary }: CommissionSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard
        label="Pipeline commission"
        value={formatCurrency(summary.pipeline)}
        hint="Deals in early stages"
        accent="neutral"
      />
      <MetricCard
        label="Expected"
        value={formatCurrency(summary.expected)}
        hint="Deals nearing settlement"
        accent="action"
      />
      <MetricCard
        label="Paid"
        value={formatCurrency(summary.paid)}
        hint={summary.period}
        accent="brand"
      />
    </div>
  )
}
