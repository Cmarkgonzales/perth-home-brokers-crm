import type { DealStage } from '@/domain/deals/deal.types'
import {
  DEAL_STAGES,
  isStageCompleted,
  isStageCurrent,
} from '@/domain/deals/deal-stage'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface DealStageStepperProps {
  currentStage: DealStage
  compact?: boolean
}

export function DealStageStepper ({
  currentStage,
  compact = false,
}: DealStageStepperProps) {
  const displayStages = compact
    ? (['lead', 'qualified', 'finance', 'land', 'builder', 'package', 'construction', 'settlement'] as DealStage[])
    : DEAL_STAGES

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-max items-center gap-0">
        {displayStages.map((stage, index) => {
          const completed = isStageCompleted(currentStage, stage)
          const current = isStageCurrent(currentStage, stage)
          const future = !completed && !current

          return (
            <div key={stage} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5 px-2">
                <div
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors',
                    completed &&
                      'border-phb-red bg-phb-red text-white',
                    current &&
                      'border-phb-yellow bg-phb-yellow text-text-primary',
                    future &&
                      'border-border-strong bg-surface-muted text-text-tertiary'
                  )}
                  aria-current={current ? 'step' : undefined}
                >
                  {completed ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    <span className="size-2 rounded-full bg-current" />
                  )}
                </div>
                <span
                  className={cn(
                    'max-w-[72px] text-center text-[11px] leading-tight',
                    current && 'font-semibold text-text-primary',
                    completed && 'text-text-secondary',
                    future && 'text-text-tertiary'
                  )}
                >
                  {DEAL_STAGE_LABELS[stage]}
                </span>
              </div>
              {index < displayStages.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-6 sm:w-10',
                    completed ? 'bg-phb-red' : 'bg-border'
                  )}
                  aria-hidden
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
