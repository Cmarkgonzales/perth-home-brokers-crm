'use client'

import type { LandLot } from '@/domain/packages/package.types'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface LandCardProps {
  lot: LandLot
  selected: boolean
  onSelect: (id: string) => void
}

export function LandCard ({ lot, selected, onSelect }: LandCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(lot.id)}
      className={cn(
        'w-full rounded-xl border p-4 text-left transition-colors',
        selected
          ? 'border-phb-yellow bg-[#FFFCF0] ring-1 ring-phb-yellow/50'
          : 'border-border bg-surface hover:bg-surface-muted'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
            <MapPin className="size-3.5 text-phb-red" aria-hidden />
            {lot.suburb}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{lot.name}</p>
          <p className="mt-2 text-xs text-text-tertiary">{lot.size}</p>
        </div>
        <p className="text-lg font-semibold text-text-primary">
          {formatCurrency(lot.price)}
        </p>
      </div>
    </button>
  )
}
