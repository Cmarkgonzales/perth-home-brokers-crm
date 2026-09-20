import type { Communication } from '@/domain/communications/communication.types'
import { formatDate } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, MessageSquare, Phone } from 'lucide-react'

interface CommunicationsLogProps {
  communications: Communication[]
}

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
} as const

const channelLabels = {
  email: 'Email',
  sms: 'SMS',
  call: 'Call',
} as const

export function CommunicationsLog ({ communications }: CommunicationsLogProps) {
  if (communications.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No communications recorded yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-none">
      <CardContent className="pt-6">
        <ul className="space-y-4">
          {communications.map((comm) => {
            const Icon = channelIcons[comm.channel]

            return (
              <li
                key={comm.id}
                className="flex gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-strong">
                  <Icon className="size-4 text-text-secondary" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{comm.subject}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      {channelLabels[comm.channel]}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        comm.direction === 'inbound'
                          ? 'bg-info/10 text-info'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {comm.direction}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {formatDate(comm.date)}
                  </p>
                  <p className="text-sm text-text-secondary">{comm.summary}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
