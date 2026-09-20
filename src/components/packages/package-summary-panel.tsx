import type { HouseDesign, LandLot } from '@/domain/packages/package.types'
import { formatCurrency } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PackageSummaryPanelProps {
  dealId: string
  dealName: string
  land: LandLot
  design: HouseDesign
  extrasTotal: number
  total: number
  monthlyRepayment: number
  budget?: number
  onSave: () => void
  onPresent: () => void
}

function weeklyFromMonthly (monthly: number): number {
  return Math.round((monthly * 12) / 52)
}

function BudgetNote ({
  total,
  budget,
}: {
  total: number
  budget: number
}) {
  const delta = budget - total

  if (delta > 0) {
    return (
      <p className="text-sm font-medium text-success">
        {formatCurrency(delta)} under the {formatCurrency(budget)} budget
      </p>
    )
  }

  if (delta < 0) {
    return (
      <p className="text-sm font-medium text-warning">
        {formatCurrency(Math.abs(delta))} over the {formatCurrency(budget)} budget
      </p>
    )
  }

  return (
    <p className="text-sm font-medium text-text-secondary">
      On the {formatCurrency(budget)} budget
    </p>
  )
}

function SummaryRow ({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="text-sm font-medium tabular-nums text-text-primary">{value}</dd>
    </div>
  )
}

export function PackageSummaryPanel ({
  dealId,
  dealName,
  land,
  design,
  extrasTotal,
  total,
  monthlyRepayment,
  budget,
  onSave,
  onPresent,
}: PackageSummaryPanelProps) {
  const weeklyRepayment = weeklyFromMonthly(monthlyRepayment)

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-base font-semibold">Package total</CardTitle>
        <Badge variant="secondary" className="bg-surface-strong text-text-secondary">
          Draft
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="divide-y divide-border border-y border-border">
          <SummaryRow
            label={`Land, ${land.suburb}`}
            value={formatCurrency(land.price)}
          />
          <SummaryRow
            label={`Build, ${design.name}`}
            value={formatCurrency(design.price)}
          />
          <SummaryRow
            label="Upgrades"
            value={formatCurrency(extrasTotal)}
          />
        </dl>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-text-secondary">Total</p>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-text-primary">
              {formatCurrency(total)}
            </p>
          </div>
          {budget !== undefined ? (
            <BudgetNote total={total} budget={budget} />
          ) : null}
        </div>

        <div className="rounded-lg bg-surface-muted px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">Estimated repayment</p>
            <p className="text-sm font-semibold tabular-nums text-text-primary">
              {formatCurrency(weeklyRepayment)} / week
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-text-tertiary">
            Demo estimate only. It assumes a 10% deposit and an illustrative 6.2%
            rate over 30 years. It isn&apos;t a lending calculation.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="brand" className="h-9 w-full" onClick={onSave}>
            Save package
          </Button>
          <Button
            className="h-9 w-full bg-text-primary text-surface hover:bg-text-primary/90"
            onClick={onPresent}
          >
            Present to client
          </Button>
          <ButtonLink
            href={`/deals/${dealId}`}
            variant="ghost"
            className="h-9 w-full text-text-secondary"
          >
            Back to {dealName}
          </ButtonLink>
        </div>
      </CardContent>
    </Card>
  )
}
