import type { Commission } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DealCommissionCardProps {
  commission: Commission
}

const STATUS_CLASS: Record<Commission['status'], string> = {
  expected: 'bg-info/10 text-info',
  pipeline: 'bg-surface-strong text-text-secondary',
  paid: 'bg-success/10 text-success',
}

function statusLabel (status: Commission['status']): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
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
            href={`/commissions/${commission.dealId}`}
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
              <Badge
                variant="secondary"
                className={cn(STATUS_CLASS[commission.status])}
              >
                {statusLabel(commission.status)}
              </Badge>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
