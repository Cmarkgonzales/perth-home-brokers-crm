import Link from 'next/link'
import type { Deal } from '@/domain/deals/deal.types'
import { formatCurrency } from '@/lib/formatting'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'

interface DealListProps {
  deals: Deal[]
}

export function DealList ({ deals }: DealListProps) {
  if (deals.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No deals match the selected filter.
      </p>
    )
  }

  return (
    <>
      <ul className="divide-y divide-border md:hidden">
        {deals.map((deal) => (
          <li key={deal.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/deals/${deal.id}`}
                  className="font-medium text-text-primary hover:underline"
                >
                  {deal.name}
                </Link>
                <p className="font-mono text-xs text-text-tertiary">{deal.id}</p>
              </div>
              {deal.atRisk && (
                <AlertTriangle
                  className="size-4 shrink-0 text-danger"
                  aria-label="At risk"
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DealStageBadge stage={deal.stage} />
              <span className="text-sm font-medium tabular-nums">
                {formatCurrency(deal.value)}
              </span>
              <span className="text-xs text-text-tertiary">{deal.owner}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Progress value={deal.progress} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">
                {deal.progress}%
              </span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{deal.nextAction}</p>
            <p className="text-xs text-muted-foreground">{deal.nextActionDue}</p>
            {deal.atRisk && (
              <Badge
                variant="secondary"
                className="mt-2 bg-danger/10 text-danger"
              >
                At risk
              </Badge>
            )}
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Next action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="font-medium text-text-primary hover:underline"
                    >
                      {deal.name}
                    </Link>
                    {deal.atRisk && (
                      <AlertTriangle
                        className="size-4 text-danger"
                        aria-label="At risk"
                      />
                    )}
                  </div>
                  <p className="font-mono text-xs text-text-tertiary">{deal.id}</p>
                </TableCell>
                <TableCell>
                  <DealStageBadge stage={deal.stage} />
                </TableCell>
                <TableCell>{formatCurrency(deal.value)}</TableCell>
                <TableCell>
                  <div className="flex min-w-28 items-center gap-2">
                    <Progress value={deal.progress} className="h-2 w-24 shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {deal.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>{deal.owner}</TableCell>
                <TableCell>
                  <p className="text-sm">{deal.nextAction}</p>
                  <p className="text-xs text-muted-foreground">
                    {deal.nextActionDue}
                  </p>
                  {deal.atRisk && (
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-danger/10 text-danger"
                    >
                      At risk
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
