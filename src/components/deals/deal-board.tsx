'use client'

import { useState } from 'react'
import type { DealBoardColumn } from '@/data/demo'
import { DealBoardCardItem } from '@/components/deals/deal-board-card'

interface DealBoardProps {
  columns: DealBoardColumn[]
}

const VISIBLE_CARDS = 3

export function DealBoard ({ columns }: DealBoardProps) {
  const [expandedColumnIds, setExpandedColumnIds] = useState<Set<string>>(
    () => new Set()
  )
  const hasDeals = columns.some((column) => column.deals.length > 0)

  if (!hasDeals) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No deals match the selected filter.
      </p>
    )
  }

  function showMore (columnId: string) {
    setExpandedColumnIds((current) => {
      const next = new Set(current)
      next.add(columnId)
      return next
    })
  }

  function showFewer (columnId: string) {
    setExpandedColumnIds((current) => {
      const next = new Set(current)
      next.delete(columnId)
      return next
    })
  }

  return (
    <div className="-mx-4 -mb-5 flex min-h-0 flex-1 flex-col px-4 sm:-mx-6 sm:-mb-6 sm:px-6 lg:-mx-8 lg:-mb-8 lg:px-8">
      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto overflow-y-hidden">
        {columns.map((column) => {
          const isExpanded = expandedColumnIds.has(column.id)
          const visibleDeals = isExpanded
            ? column.deals
            : column.deals.slice(0, VISIBLE_CARDS)
          const remainingCount = column.deals.length - VISIBLE_CARDS

          return (
            <section
              key={column.id}
              aria-labelledby={`deal-board-${column.id}`}
              className="flex h-full w-[16.5rem] shrink-0 flex-col rounded-[12px] bg-surface-strong p-3"
            >
              <header className="mb-3 shrink-0 border-b border-border pb-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <h2
                    id={`deal-board-${column.id}`}
                    className="text-sm font-semibold text-text-primary"
                  >
                    {column.label}
                  </h2>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium tabular-nums text-text-tertiary">
                    {column.deals.length}
                  </span>
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                {visibleDeals.map((card) => (
                  <DealBoardCardItem key={card.deal.id} card={card} />
                ))}

                {remainingCount > 0 && !isExpanded ? (
                  <button
                    type="button"
                    onClick={() => showMore(column.id)}
                    className="px-1 py-1 text-left text-sm text-text-tertiary hover:text-text-primary hover:underline"
                  >
                    {remainingCount} more {remainingCount === 1 ? 'deal' : 'deals'}
                  </button>
                ) : null}

                {remainingCount > 0 && isExpanded ? (
                  <button
                    type="button"
                    onClick={() => showFewer(column.id)}
                    className="px-1 py-1 text-left text-sm text-text-tertiary hover:text-text-primary hover:underline"
                  >
                    Show fewer
                  </button>
                ) : null}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
