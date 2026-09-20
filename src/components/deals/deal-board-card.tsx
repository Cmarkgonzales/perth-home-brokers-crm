import Link from 'next/link'
import type { DealBoardCard } from '@/data/demo'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface DealBoardCardItemProps {
  card: DealBoardCard
}

function ownerAvatarClass (owner: string): string {
  if (owner.startsWith('A')) {
    return 'bg-info text-white'
  }

  return 'bg-text-primary text-surface'
}

export function DealBoardCardItem ({ card }: DealBoardCardItemProps) {
  const { deal, clientName, ownerInitial, flag } = card

  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block rounded-[10px] border border-border bg-surface p-4 transition-colors hover:bg-table-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-text-primary">{deal.name}</p>
          <p className="mt-0.5 truncate text-sm text-text-secondary">{clientName}</p>
          <p className="mt-3 text-base font-semibold tabular-nums text-text-primary">
            {formatCurrency(deal.value)}
          </p>
        </div>
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
            ownerAvatarClass(deal.owner)
          )}
          aria-label={`Owner ${deal.owner}`}
        >
          {ownerInitial}
        </span>
      </div>
      {flag ? (
        <Badge
          variant="secondary"
          className="mt-3 bg-warning/10 font-medium text-warning"
        >
          {flag.label}
        </Badge>
      ) : null}
    </Link>
  )
}
