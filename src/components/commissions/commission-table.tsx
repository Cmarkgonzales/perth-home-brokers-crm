'use client'

import type { Commission } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { CommissionStatusBadge } from '@/components/commissions/commission-status-badge'
import { ConsultantAvatar } from '@/components/commissions/consultant-avatar'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface CommissionTableProps {
  commissions: Commission[]
  selectedId?: string
  onSelect: (commissionId: string) => void
}

export function CommissionTable ({
  commissions,
  selectedId,
  onSelect,
}: CommissionTableProps) {
  if (commissions.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          No commissions recorded yet.
        </p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border py-0 shadow-none">
      <ul className="divide-y divide-border lg:hidden">
        {commissions.map((commission) => {
          const isSelected = commission.id === selectedId

          return (
            <li key={commission.id}>
              <button
                type="button"
                onClick={() => onSelect(commission.id)}
                aria-pressed={isSelected}
                className={cn(
                  'flex w-full flex-col gap-2 p-4 text-left transition-colors hover:bg-table-hover focus-visible:bg-table-hover focus-visible:outline-none',
                  isSelected && 'bg-table-hover'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-text-primary">
                    {commission.dealName}
                  </p>
                  <CommissionStatusBadge status={commission.status} />
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <ConsultantAvatar name={commission.consultant} />
                  {commission.consultant}
                </div>
                <p className="text-sm font-medium tabular-nums text-text-primary">
                  {formatCurrency(commission.consultantAmount)}
                </p>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Deal</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead className="text-right">Deal value</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Share</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => {
              const isSelected = commission.id === selectedId

              return (
                <TableRow
                  key={commission.id}
                  data-state={isSelected ? 'selected' : undefined}
                  aria-selected={isSelected}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => onSelect(commission.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(commission.id)
                    }
                  }}
                >
                  <TableCell className="max-w-40 font-medium whitespace-normal text-text-primary">
                    {commission.dealName}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-text-secondary">
                      <ConsultantAvatar name={commission.consultant} />
                      {commission.consultant}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(commission.dealValue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(commission.grossCommission)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(commission.consultantAmount)}
                  </TableCell>
                  <TableCell>
                    <CommissionStatusBadge status={commission.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
