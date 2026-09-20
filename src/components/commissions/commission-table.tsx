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
    </Card>
  )
}
