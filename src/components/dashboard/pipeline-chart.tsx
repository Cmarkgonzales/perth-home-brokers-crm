import Link from 'next/link'
import type { DashboardPipelineColumn } from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PipelineChartProps {
  stages: DashboardPipelineColumn[]
  dealCount: number
}

const BAR_TONES = [
  'bg-info/25',
  'bg-info/40',
  'bg-info/55',
  'bg-info/70',
  'bg-info',
  'bg-info/90',
] as const

export function PipelineChart ({ stages, dealCount }: PipelineChartProps) {
  const maxCount = Math.max(...stages.map((stage) => stage.count), 1)
  const stageLabel =
    dealCount === 1 ? '1 deal across six stages' : `${dealCount} deals across six stages`

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <CardTitle className="text-base font-semibold text-text-primary">
          Deal pipeline
        </CardTitle>
        <p className="text-xs text-text-tertiary">{stageLabel}</p>
      </CardHeader>
      <CardContent>
        <div className="flex h-52 items-end gap-2 sm:gap-3">
          {stages.map((stage, index) => {
            const height = stage.count === 0
              ? 8
              : Math.max((stage.count / maxCount) * 100, 14)

            return (
              <Link
                key={stage.id}
                href={stage.href}
                className="group flex min-w-0 flex-1 flex-col items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`${stage.count} ${stage.count === 1 ? 'deal' : 'deals'} in ${stage.label}`}
              >
                <span className="text-sm font-semibold tabular-nums text-text-primary">
                  {stage.count}
                </span>
                <div className="flex h-36 w-full items-end justify-center sm:h-40">
                  <span
                    className={cn(
                      'block w-full max-w-[4.5rem] rounded-t-lg transition-opacity group-hover:opacity-80',
                      BAR_TONES[index] ?? 'bg-info/50'
                    )}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-center text-xs text-text-tertiary">
                  {stage.label}
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
