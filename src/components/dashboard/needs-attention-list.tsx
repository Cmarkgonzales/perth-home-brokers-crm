import Link from 'next/link'
import type { AttentionItem } from '@/data/demo'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NeedsAttentionListProps {
  items: AttentionItem[]
}

const severityLabels = {
  high: 'Urgent',
  medium: 'Follow up',
  low: 'Low',
} as const

export function NeedsAttentionList ({ items }: NeedsAttentionListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Needs attention</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-table-hover"
          >
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-text-primary">{item.title}</p>
              <p className="text-[13px] text-text-secondary">{item.description}</p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                'shrink-0',
                item.severity === 'high' && 'bg-danger/10 text-danger',
                item.severity === 'medium' && 'bg-warning/10 text-warning'
              )}
            >
              {severityLabels[item.severity]}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
