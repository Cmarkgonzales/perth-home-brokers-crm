import Link from 'next/link'
import { Columns3, List } from 'lucide-react'
import type { DealsQuery, DealsView } from '@/lib/deals-href'
import { buildDealsHref } from '@/lib/deals-href'
import { cn } from '@/lib/utils'

interface DealsViewToggleProps {
  query: DealsQuery
}

const views: Array<{ id: DealsView; label: string; icon: typeof Columns3 }> = [
  { id: 'board', label: 'Board', icon: Columns3 },
  { id: 'list', label: 'List', icon: List },
]

export function DealsViewToggle ({ query }: DealsViewToggleProps) {
  const currentView = query.view ?? 'board'

  return (
    <div
      className="inline-flex h-9 items-center rounded-lg border border-border bg-surface p-0.5"
      role="group"
      aria-label="Deal views"
    >
      {views.map((view) => {
        const isActive = currentView === view.id
        const Icon = view.icon

        return (
          <Link
            key={view.id}
            href={buildDealsHref({ ...query, view: view.id })}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-surface-strong text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <Icon className="size-4" aria-hidden />
            {view.label}
          </Link>
        )
      })}
    </div>
  )
}
