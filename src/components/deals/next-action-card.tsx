import type { Deal } from '@/domain/deals/deal.types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface NextActionCardProps {
  deal: Deal
}

function nextActionCta (deal: Deal): { label: string; href: string } {
  const action = deal.nextAction.toLowerCase()

  if (action.includes('document')) {
    return {
      label: action.includes('request') ? 'Request document' : 'Review documents',
      href: `/documents?deal=${deal.id}`,
    }
  }

  if (action.includes('package') || action.includes('builder')) {
    return {
      label: 'Open package',
      href: `/packages/builder?dealId=${deal.id}`,
    }
  }

  return {
    label: 'Take action',
    href: `/deals/${deal.id}`,
  }
}

export function NextActionCard ({ deal }: NextActionCardProps) {
  const isOverdue =
    deal.nextActionDue.toLowerCase().includes('overdue') ||
    deal.nextActionDue.toLowerCase().includes('ago')
  const cta = nextActionCta(deal)

  return (
    <Card className="border-border shadow-none">
      <CardContent className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-tertiary">Next action</p>
          <p className="mt-1 text-base font-semibold text-text-primary">
            {deal.nextAction}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Avatar size="sm">
                <AvatarFallback className="bg-surface-strong text-[10px] font-semibold text-text-primary">
                  {deal.owner.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              Assigned to {deal.owner}
            </span>
            <span className={isOverdue ? 'font-medium text-danger' : undefined}>
              Due {deal.nextActionDue}
            </span>
          </div>
        </div>
        <ButtonLink href={cta.href} variant="brand" className="h-9 shrink-0 px-4">
          {cta.label}
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
