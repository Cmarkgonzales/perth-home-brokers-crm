import type { Deal } from '@/domain/deals/deal.types'
import { DealStageStepper } from '@/components/deals/deal-stage-stepper'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DealProgressCardProps {
  deal: Deal
}

export function DealProgressCard ({ deal }: DealProgressCardProps) {
  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Deal progress</CardTitle>
        <CardAction>
          <p className="text-sm text-text-secondary">
            <span className="font-medium tabular-nums text-text-primary">
              {deal.progress}%
            </span>{' '}
            complete
          </p>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-5">
        <DealStageStepper currentStage={deal.stage} />
        <div
          role="progressbar"
          aria-valuenow={deal.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Deal progress"
          className="h-2 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-phb-yellow"
            style={{ width: `${deal.progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
