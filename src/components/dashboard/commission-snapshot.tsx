import Link from 'next/link'
import type { CommissionSummary } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CommissionSnapshotProps {
  summary: CommissionSummary
}

export function CommissionSnapshot ({ summary }: CommissionSnapshotProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Commissions · {summary.period}
        </CardTitle>
        <Link
          href="/commissions"
          className="text-xs font-medium text-text-secondary hover:text-text-primary"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-tertiary">
              Pipeline
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
              {formatCurrency(summary.pipeline)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-tertiary">
              Expected
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
              {formatCurrency(summary.expected)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-tertiary">
              Paid
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-success">
              {formatCurrency(summary.paid)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
