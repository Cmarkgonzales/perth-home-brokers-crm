'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { DealStage } from '@/domain/deals/deal.types'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface DealStageFilterProps {
  currentStage?: DealStage
}

const filterLinkClass =
  'inline-flex h-7 items-center rounded-lg border px-2.5 text-[0.8rem] font-medium transition-colors'

export function DealStageFilter ({ currentStage }: DealStageFilterProps) {
  const pathname = usePathname()
  const stages = Object.keys(DEAL_STAGE_LABELS) as DealStage[]

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={pathname}
        className={cn(
          filterLinkClass,
            currentStage
            ? 'border-border bg-surface text-text-primary hover:bg-surface-muted'
            : 'border-phb-yellow bg-phb-yellow text-text-primary hover:bg-phb-yellow-dark'
        )}
      >
        All deals
      </Link>
      {stages.map((stage) => (
        <Link
          key={stage}
          href={`${pathname}?stage=${stage}`}
          className={cn(
            filterLinkClass,
            currentStage === stage
              ? 'border-phb-yellow bg-phb-yellow text-text-primary hover:bg-phb-yellow-dark'
              : 'border-border bg-surface text-text-primary hover:bg-surface-muted'
          )}
        >
          {DEAL_STAGE_LABELS[stage]}
        </Link>
      ))}
    </div>
  )
}
