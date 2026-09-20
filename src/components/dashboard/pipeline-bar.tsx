import Link from 'next/link'
import type { PipelineStageCount } from '@/data/demo'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PipelineBarProps {
  stages: PipelineStageCount[]
}

export function PipelineBar ({ stages }: PipelineBarProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Deal pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map(({ stage, count }) => {
          const isCurrentFocus = stage === 'finance'

          return (
            <Link
              key={stage}
              href={`/deals?stage=${stage}`}
              className="group block space-y-1 rounded-lg p-1 transition-colors hover:bg-table-hover"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary">
                  {DEAL_STAGE_LABELS[stage]}
                </span>
                <span className="text-text-tertiary tabular-nums">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isCurrentFocus ? 'bg-phb-yellow' : 'bg-text-primary/70'
                  )}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
