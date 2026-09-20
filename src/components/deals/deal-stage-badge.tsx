import type { DealStage } from '@/domain/deals/deal.types'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface DealStageBadgeProps {
  stage: DealStage
  className?: string
}

export function DealStageBadge ({ stage, className }: DealStageBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-info/10 text-info',
        stage === 'finance' && 'bg-warning/10 text-warning',
        stage === 'settlement' && 'bg-success/10 text-success',
        stage === 'lead' && 'bg-muted text-muted-foreground',
        className
      )}
    >
      {DEAL_STAGE_LABELS[stage]}
    </Badge>
  )
}
