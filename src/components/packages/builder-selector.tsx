'use client'

import type { HouseDesign } from '@/domain/packages/package.types'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'

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
            onClick={() => onSelect(design.id)}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors',
              selected
                ? 'border-phb-yellow bg-[#FFFCF0] ring-1 ring-phb-yellow/50'
                : 'border-border bg-surface hover:bg-surface-muted'
            )}
          >
            <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-surface-strong">
              <Home className="size-6 text-phb-red" aria-hidden />
            </div>
            <p className="font-semibold text-text-primary">{design.name}</p>
            <p className="text-sm text-text-secondary">{design.builder}</p>
            <p className="mt-1 text-xs text-text-tertiary">
              {design.bedrooms} bed · {design.bathrooms} bath · {design.cars} car
            </p>
            <p className="mt-2 font-semibold text-text-primary">
              {formatCurrency(design.price)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
