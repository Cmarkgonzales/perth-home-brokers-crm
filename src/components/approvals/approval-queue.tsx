import Link from 'next/link'
import type { Approval } from '@/domain/approvals/approval.types'
import { formatCurrency, formatDate } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertTriangle, Clock } from 'lucide-react'

interface ApprovalQueueProps {
  approvals: Approval[]
}

function isOverdue (dueDate: string): boolean {
  return dueDate < '2026-03-20'
}

export function ApprovalQueue ({ approvals }: ApprovalQueueProps) {
  if (approvals.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No pending approvals.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => {
        const overdue = isOverdue(approval.dueDate)

        return (
          <Link key={approval.id} href={`/approvals/${approval.id}`}>
            <Card
              className={cn(
                'border-border shadow-none transition-colors hover:bg-table-hover',
                overdue && 'border-warning/40'
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {approval.title}
                  </CardTitle>
                  <p className="text-sm text-text-secondary">
                    {approval.clientName} · {formatCurrency(approval.dealValue)}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="capitalize bg-warning/10 text-warning"
                >
                  {approval.type}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-text-secondary line-clamp-2">
                  {approval.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden />
                    Due {formatDate(approval.dueDate)}
                  </span>
                  <span>Assignee: {approval.assignee}</span>
                  {overdue && (
                    <span className="inline-flex items-center gap-1 font-medium text-danger">
                      <AlertTriangle className="size-3.5" aria-hidden />
                      Overdue
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
