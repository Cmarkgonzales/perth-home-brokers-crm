import type { Deal } from '@/domain/deals/deal.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User } from 'lucide-react'

interface NextActionCardProps {
  deal: Deal
}

export function NextActionCard ({ deal }: NextActionCardProps) {
  const isOverdue = deal.nextActionDue.toLowerCase().includes('overdue') ||
    deal.nextActionDue.toLowerCase().includes('ago')

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Next action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-text-primary">{deal.nextAction}</p>
        <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden />
            <span className={isOverdue ? 'font-medium text-danger' : undefined}>
              Due: {deal.nextActionDue}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="size-3.5" aria-hidden />
            {deal.owner}
          </span>
        </div>
        <Button variant="brand" size="sm">
          {deal.nextAction.includes('Request') ? 'Request document' : 'Take action'}
        </Button>
      </CardContent>
    </Card>
  )
}
