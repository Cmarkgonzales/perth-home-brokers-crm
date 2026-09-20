import type { FunnelStage } from '@/domain/reporting/pipeline-metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ConversionFunnelProps {
  stages: FunnelStage[]
  conversionRate: number
}

export function ConversionFunnel ({ stages, conversionRate }: ConversionFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Lead → Settlement conversion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary">{stage.label}</span>
                <span className="tabular-nums text-text-tertiary">{stage.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className="h-full rounded-full bg-phb-red"
                  style={{ width: `${(stage.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-surface-strong px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-text-tertiary">
            Conversion rate
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
            {conversionRate}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
