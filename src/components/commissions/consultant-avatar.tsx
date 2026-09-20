import { getConsultantAvatarClass } from '@/domain/commissions/commission.constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ConsultantAvatarProps {
  name: string
  size?: 'default' | 'sm'
}

function consultantInitial (name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

export function ConsultantAvatar ({
  name,
  size = 'sm',
}: ConsultantAvatarProps) {
  return (
    <Avatar size={size}>
      <AvatarFallback
        className={cn(
          'text-[10px] font-semibold',
          getConsultantAvatarClass(name)
        )}
      >
        {consultantInitial(name)}
      </AvatarFallback>
    </Avatar>
  )
}
