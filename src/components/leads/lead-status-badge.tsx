import type { LeadStatus } from '@/domain/leads/lead.types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

function statusClassName (status: LeadStatus): string {
  switch (status) {
    case 'Converted':
      return 'bg-success/10 text-success'
    case 'Qualified':
      return 'bg-info/10 text-info'
    case 'Contacted':
      return 'bg-warning/10 text-warning'
    case 'Lost':
      return 'bg-danger/10 text-danger'
    case 'New':
    default:
      return 'bg-surface-strong text-text-secondary'
  }
}

export function LeadStatusBadge ({ status, className }: LeadStatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(statusClassName(status), className)}>
      {status}
    </Badge>
  )
}
