'use client'

import type { LandLot } from '@/domain/packages/package.types'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { SelectedBadge } from '@/components/packages/selected-badge'

interface LandCardProps {
  lot: LandLot
  selected: boolean
  onSelect: (id: string) => void
}

export function LandCard ({ lot, selected, onSelect }: LandCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(lot.id)}
      className={cn(
        'relative w-full rounded-xl border p-3 text-left transition-colors',
        selected
          ? 'border-phb-yellow bg-[#FFFCF0] ring-1 ring-phb-yellow/50'
          : 'border-border bg-surface hover:bg-surface-muted'
      )}
    >
      {selected ? <SelectedBadge /> : null}
      <div
        className="relative mb-3 h-[88px] overflow-hidden rounded-lg bg-success/10"
        aria-hidden
      >
        <div className="absolute inset-x-7 top-7 h-10 rounded-sm border border-dashed border-info/40 bg-surface/80" />
        <div className="absolute inset-x-0 bottom-0 h-3 bg-border-strong/80" />
      </div>
      <p className="text-sm font-semibold text-text-primary">{lot.suburb}</p>
      <p className="mt-0.5 text-xs text-text-tertiary">{lot.size}</p>
      <p className="mt-2 text-base font-semibold tabular-nums text-text-primary">
        {formatCurrency(lot.price)}
      </p>
    </button>
  )
}
