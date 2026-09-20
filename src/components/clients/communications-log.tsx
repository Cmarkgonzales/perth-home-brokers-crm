import type { Communication } from '@/domain/communications/communication.types'
import { formatCompactDate } from '@/lib/formatting'
import { DEMO_TODAY } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'

interface CommunicationsLogProps {
  communications: Communication[]
}

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  whatsapp: MessageCircle,
} as const

const channelLabels = {
  email: 'Email',
  sms: 'SMS',
  call: 'Call',
  whatsapp: 'WhatsApp',
} as const

function communicationHeading (comm: Communication): string {
  const label = channelLabels[comm.channel]

  if (comm.channel === 'whatsapp' && comm.direction === 'inbound') {
    return comm.sender ? `WhatsApp from ${comm.sender}` : 'WhatsApp from client'
  }

  if (comm.direction === 'inbound') {
    return comm.sender ? `${label} from ${comm.sender}` : `${label} from client`
  }

  return `${label} to client`
}

export function CommunicationsLog ({ communications }: CommunicationsLogProps) {
  if (communications.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Messages and calls</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No communications recorded yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gap-0 border-border py-0 shadow-none">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-base">Messages and calls</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {communications.map((comm) => {
            const Icon = channelIcons[comm.channel]

            return (
              <li key={comm.id} className="flex gap-3 px-5 py-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-strong">
                  <Icon className="size-4 text-text-secondary" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-text-primary">
                      {communicationHeading(comm)}
                    </p>
                    <p className="shrink-0 text-xs text-text-tertiary">
                      {comm.sender
                        ? `${formatCompactDate(comm.date, DEMO_TODAY)}, ${comm.sender}`
                        : formatCompactDate(comm.date, DEMO_TODAY)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{comm.summary}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
