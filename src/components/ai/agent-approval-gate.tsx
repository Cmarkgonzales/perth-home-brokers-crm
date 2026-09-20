'use client'

import type { PendingApproval } from '@/domain/ai/agent.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

interface AgentApprovalGateProps {
  approval: PendingApproval
  onApprove: () => void
  onCancel: () => void
}

export function AgentApprovalGate ({
  approval,
  onApprove,
  onCancel,
}: AgentApprovalGateProps) {
  return (
    <Card className="border border-phb-red/20 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4 text-phb-red" aria-hidden />
          Human approval required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-text-tertiary">{approval.title}</p>
          {approval.recipient && (
            <p className="text-sm font-medium text-text-primary">
              To: {approval.recipient}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-white p-4 text-sm text-text-secondary">
          {approval.preview}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            className="bg-phb-yellow text-text-primary hover:bg-phb-yellow-dark"
            onClick={onApprove}
          >
            Approve &amp; send
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <p className="text-xs text-text-tertiary">
          Demo only — no message will be sent. Approval records activity in the agent audit trail.
        </p>
      </CardContent>
    </Card>
  )
}
