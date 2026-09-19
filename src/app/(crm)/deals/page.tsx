import Link from 'next/link'
import { deals } from '@/data/deals'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
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

function formatCurrency (value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DealsPage () {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Deals</h2>
        <p className="text-sm text-muted-foreground">
          Monitor deal progress from lead through settlement.
        </p>
      </div>

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
                <Link
                  href={`/deals/${deal.id}`}
                  className="font-medium hover:underline"
                >
                  {deal.name}
                </Link>
                <p className="text-xs text-muted-foreground">{deal.id}</p>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {DEAL_STAGE_LABELS[deal.stage]}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(deal.value)}</TableCell>
              <TableCell>
                <div className="flex min-w-28 items-center gap-2">
                  <Progress value={deal.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {deal.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>{deal.owner}</TableCell>
              <TableCell className="text-muted-foreground">
                {deal.nextAction}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
