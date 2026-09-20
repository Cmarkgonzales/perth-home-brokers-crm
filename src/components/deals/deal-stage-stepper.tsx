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
}

export function DealStageStepper ({ currentStage }: DealStageStepperProps) {
  return (
    <ol className="flex w-full min-w-0">
      {DEAL_STAGES.map((stage, index) => {
        const completed = isStageCompleted(currentStage, stage)
        const current = isStageCurrent(currentStage, stage)
        const isFirst = index === 0
        const isLast = index === DEAL_STAGES.length - 1
        const incomingFilled = completed || current
        const outgoingFilled = completed

        return (
          <li key={stage} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  'h-0.5 flex-1',
                  isFirst
                    ? 'bg-transparent'
                    : incomingFilled
                      ? 'bg-phb-yellow'
                      : 'bg-border'
                )}
                aria-hidden
              />
              <div
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                  completed && 'border-phb-yellow bg-phb-yellow text-text-primary',
                  current && 'border-phb-yellow bg-surface',
                  !completed &&
                    !current &&
                    'border-border-strong bg-surface text-text-tertiary'
                )}
                aria-current={current ? 'step' : undefined}
              >
                {completed ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      current ? 'bg-text-primary' : 'bg-border-strong'
                    )}
                  />
                )}
              </div>
              <div
                className={cn(
                  'h-0.5 flex-1',
                  isLast
                    ? 'bg-transparent'
                    : outgoingFilled
                      ? 'bg-phb-yellow'
                      : 'bg-border'
                )}
                aria-hidden
              />
            </div>
            <span
              className={cn(
                'mt-2 max-w-full px-0.5 text-center text-[11px] leading-tight',
                current && 'font-semibold text-text-primary',
                completed && 'text-text-secondary',
                !completed && !current && 'text-text-tertiary'
              )}
            >
              {DEAL_STAGE_LABELS[stage]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
