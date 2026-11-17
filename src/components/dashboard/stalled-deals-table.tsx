import Link from 'next/link'
import type { StalledDealRow } from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'
import { ConsultantAvatar } from '@/components/commissions/consultant-avatar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface StalledDealsTableProps {
  rows: StalledDealRow[]
}

function SeverityPill ({ severity }: { severity: StalledDealRow['severity'] }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-full px-2 text-xs font-medium',
        severity === 'Urgent' && 'bg-danger/10 text-danger',
        severity === 'High' && 'bg-warning/10 text-warning'
      )}
    >
      {severity}
    </span>
  )
}

function StalledDealMobileRow ({ row }: { row: StalledDealRow }) {
  return (
    <li>
      <Link
        href={row.href}
        className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-table-hover focus-visible:bg-table-hover focus-visible:outline-none sm:px-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-text-tertiary">{row.reference}</p>
            <p className="mt-0.5 text-sm font-semibold text-text-primary">
              {row.dealName}
            </p>
          </div>
          <SeverityPill severity={row.severity} />
        </div>
        <p className="text-[13px] leading-snug text-text-secondary">
          {row.blocker}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
          <span className="font-medium text-text-secondary">{row.stageLabel}</span>
          <span aria-hidden>·</span>
          <span>Due {row.dueLabel}</span>
          <span className="inline-flex items-center gap-1.5">
            <ConsultantAvatar name={row.owner} size="sm" />
            <span>{row.owner}</span>
          </span>
        </div>
      </Link>
    </li>
  )
}

export function StalledDealsTable ({ rows }: StalledDealsTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-base font-semibold text-text-primary">
          Stalled deals
        </CardTitle>
        <Link
          href="/deals?risk=1"
          className="shrink-0 text-xs font-medium text-text-secondary hover:text-text-primary"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-text-secondary">
            No deals are flagged at risk right now.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-border md:hidden">
              {rows.map((row) => (
                <StalledDealMobileRow key={row.dealId} row={row} />
              ))}
            </ul>

            <div className="hidden md:block">
              <Table className="min-w-0 lg:min-w-[40rem]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Deal</TableHead>
                    <TableHead className="hidden lg:table-cell">Stage</TableHead>
                    <TableHead>Broker</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Blocker
                    </TableHead>
                    <TableHead className="pr-5 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.dealId} className="hover:bg-table-hover">
                      <TableCell className="max-w-[12rem] pl-5 font-medium sm:max-w-none">
                        <Link
                          href={row.href}
                          className="block min-w-0 rounded-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <span className="font-mono text-xs text-text-tertiary">
                            {row.reference}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-text-primary">
                            {row.dealName}
                          </span>
                          <span className="mt-0.5 block text-xs text-text-tertiary lg:hidden">
                            {row.stageLabel}
                          </span>
                          <span className="mt-1 line-clamp-2 text-xs text-text-secondary xl:hidden">
                            {row.blocker}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-text-secondary lg:table-cell">
                        {row.stageLabel}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-2">
                          <ConsultantAvatar name={row.owner} />
                          <span className="hidden text-sm text-text-secondary sm:inline">
                            {row.owner}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-text-secondary">
                        {row.dueLabel}
                      </TableCell>
                      <TableCell className="hidden max-w-[14rem] whitespace-normal text-sm text-text-secondary xl:table-cell">
                        {row.blocker}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <SeverityPill severity={row.severity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}