import type { Commission } from '@/domain/commissions/commission.types'
import {
  COMMISSION_STATUS_CLASS,
  COMMISSION_STATUS_LABEL,
} from '@/domain/commissions/commission.constants'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CommissionStatusBadgeProps {
  status: Commission['status']
  className?: string
}

export function CommissionStatusBadge ({
  status,
  className,
}: CommissionStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn('font-normal', COMMISSION_STATUS_CLASS[status], className)}
    >
      {COMMISSION_STATUS_LABEL[status]}
    </Badge>
  )
}
