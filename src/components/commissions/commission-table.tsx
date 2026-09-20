import Link from 'next/link'
import type { Commission } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
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
}

const statusStyles: Record<Commission['status'], string> = {
  pipeline: 'bg-surface-strong text-text-secondary',
  expected: 'bg-warning/10 text-warning',
  paid: 'bg-success/10 text-success',
}

const statusLabels: Record<Commission['status'], string> = {
  pipeline: 'Pipeline',
  expected: 'Expected',
  paid: 'Paid',
}

export function CommissionTable ({ commissions }: CommissionTableProps) {
  return (
    <Card className="overflow-hidden border-border shadow-none">
      <ul className="divide-y divide-border md:hidden">
        {commissions.map((commission) => (
          <li key={commission.id} className="p-4">
            <Link
              href={`/commissions/${commission.dealId}`}
              className="font-medium text-text-primary hover:underline"
            >
              {commission.dealName}
            </Link>
            <p className="mt-1 text-sm text-text-secondary">
              {commission.consultant}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium tabular-nums">
                {formatCurrency(commission.consultantAmount)}
              </span>
              <Badge
                variant="secondary"
                className={cn('font-normal', statusStyles[commission.status])}
              >
                {statusLabels[commission.status]}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Deal</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead className="text-right">Est. commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow key={commission.id} className="cursor-pointer">
                <TableCell>
                  <Link
                    href={`/commissions/${commission.dealId}`}
                    className="font-medium text-text-primary hover:underline"
                  >
                    {commission.dealName}
                  </Link>
                </TableCell>
                <TableCell className="text-text-secondary">
                  {commission.consultant}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(commission.consultantAmount)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn('font-normal', statusStyles[commission.status])}
                  >
                    {statusLabels[commission.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
