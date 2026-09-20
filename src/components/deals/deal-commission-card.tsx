import type { Commission } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { CommissionStatusBadge } from '@/components/commissions/commission-status-badge'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DealCommissionCardProps {
  commission: Commission
}

export function DealCommissionCard ({ commission }: DealCommissionCardProps) {
  const ratePercent = Math.round(commission.commissionRate * 1000) / 10
  const splitPercent = Math.round(
    (commission.consultantAmount / commission.grossCommission) * 100
  )

  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Commission</CardTitle>
        <CardAction>
          <ButtonLink
            href={`/commissions?deal=${commission.dealId}`}
            variant="ghost"
            size="sm"
            className="text-text-secondary"
          >
            Open
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">
              Gross at {ratePercent}%
            </dt>
            <dd className="text-sm font-medium tabular-nums text-text-primary">
              {formatCurrency(commission.grossCommission)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">
              {commission.consultant}, {splitPercent}%
            </dt>
            <dd className="text-sm font-medium tabular-nums text-text-primary">
              {formatCurrency(commission.consultantAmount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">Status</dt>
            <dd>
              <CommissionStatusBadge status={commission.status} />
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
