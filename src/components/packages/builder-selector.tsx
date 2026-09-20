'use client'

import type { HouseDesign } from '@/domain/packages/package.types'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Check, Home } from 'lucide-react'
import { SelectedBadge } from '@/components/packages/selected-badge'

interface BuilderSelectorProps {
  designs: HouseDesign[]
  selectedId: string
  onSelect: (id: string) => void
}

export function BuilderSelector ({
  designs,
  selectedId,
  onSelect,
}: BuilderSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {designs.map((design) => {
        const selected = design.id === selectedId

        return (
          <button
            key={design.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(design.id)}
            className={cn(
              'relative rounded-xl border p-4 text-left transition-colors',
              selected
                ? 'border-phb-yellow bg-[#FFFCF0] ring-1 ring-phb-yellow/50'
                : 'border-border bg-surface hover:bg-surface-muted'
            )}
          >
            {selected ? <SelectedBadge /> : null}
            <div className="mb-3 flex h-[88px] items-center justify-center rounded-lg bg-surface-muted">
              <Home className="size-8 text-phb-red" aria-hidden />
            </div>
            <p className="font-semibold text-text-primary">{design.name}</p>
            <p className="mt-1 text-xs text-text-tertiary">
              {design.bedrooms} Bed · {design.bathrooms} Bath · {design.cars} Car
            </p>
            <p className="mt-2 font-semibold tabular-nums text-text-primary">
              From {formatCurrency(design.price)}
            </p>
          </button>
        )
      })}
    </div>
  )
}

interface BuilderPickerProps {
  builders: string[]
  selectedBuilder: string
  onSelect: (builder: string) => void
}

export function BuilderPicker ({
  builders,
  selectedBuilder,
  onSelect,
}: BuilderPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {builders.map((builder) => {
        const selected = builder === selectedBuilder

        return (
          <button
            key={builder}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(builder)}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              selected
                ? 'border-phb-yellow bg-[#FFFCF0] ring-1 ring-phb-yellow/50'
                : 'border-border bg-surface hover:bg-surface-muted'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-text-primary">{builder}</p>
              {selected ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-phb-yellow px-2 py-0.5 text-xs font-medium text-text-primary">
                  <Check className="size-3" aria-hidden />
                  Selected
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              Trusted builder network
            </p>
          </button>
        )
      })}
    </div>
  )
}
