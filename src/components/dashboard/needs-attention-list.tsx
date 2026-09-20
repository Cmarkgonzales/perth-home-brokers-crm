import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { AttentionItem } from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NeedsAttentionListProps {
  items: AttentionItem[]
}

export function NeedsAttentionList ({ items }: NeedsAttentionListProps) {
  return (
    <Card id="needs-attention" className="scroll-mt-6">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-base font-semibold text-text-primary">
          Needs attention
        </CardTitle>
        <span className="inline-flex h-5 items-center rounded-full bg-phb-yellow/20 px-2 text-xs font-medium text-text-secondary">
          {items.length} open
        </span>
      </CardHeader>
      <CardContent className="px-0">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-text-secondary">
            Nothing needs attention right now.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-table-hover focus-visible:bg-table-hover focus-visible:outline-none sm:items-center"
                >
                  <span
                    className={cn(
                      'mt-1.5 size-2.5 shrink-0 rounded-full sm:mt-0',
                      item.severity === 'high' && 'bg-danger',
                      item.severity === 'medium' && 'bg-warning',
                      item.severity === 'low' && 'bg-text-disabled'
                    )}
                    aria-hidden
                  />
                  <span className="sr-only">
                    {item.severity === 'high' ? 'Urgent. ' : 'Follow up. '}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.clientName}
                    </p>
                    <p className="text-[13px] text-text-secondary">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary sm:hidden">
                      {item.meta}
                    </p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-text-tertiary sm:block">
                    {item.meta}
                  </span>
                  <span className="inline-flex h-7 shrink-0 items-center rounded-lg border border-border bg-surface px-2.5 text-[0.8rem] font-medium text-text-primary">
                    {item.actionLabel}
                    <ChevronRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
