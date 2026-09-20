'use client'

import { useEffect, useState } from 'react'
import type { AgentRun } from '@/domain/ai/agent.types'
import type { AiMessage } from '@/domain/ai/ai.types'
import {
  completeAgentRun,
  createFollowUpAgentRun,
  matchAgentRunType,
} from '@/domain/ai/mock-agent'
import { createUserMessage } from '@/domain/ai/mock-copilot'
import { AiCopilot } from '@/components/ai/ai-copilot'
import { AgentApprovalGate } from '@/components/ai/agent-approval-gate'

const FOLLOW_UP_APPROVAL_DELAY_MS = 700

export function AiCopilotWithAgents ({
  initialPrompt,
}: {
  initialPrompt?: string
}) {
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null)
  const [showApproval, setShowApproval] = useState(false)
  const [extraMessages, setExtraMessages] = useState<AiMessage[]>([])

  function handleAgentPrompt (prompt: string) {
    if (matchAgentRunType(prompt) === 'followup') {
      setShowApproval(false)
      setAgentRun(createFollowUpAgentRun())
      return
    }

    setAgentRun(null)
    setShowApproval(false)
  }

  useEffect(() => {
    if (!agentRun || showApproval) return
    if (agentRun.status !== 'running' || !agentRun.pendingApproval) return

    const timeoutId = window.setTimeout(() => {
      setAgentRun((current) =>
        current ? { ...current, status: 'awaiting_approval' } : current
      )
      setShowApproval(true)
    }, FOLLOW_UP_APPROVAL_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [agentRun, showApproval])

  function handleApprove () {
    if (!agentRun) return
    const completed = completeAgentRun(agentRun)
    setAgentRun(completed)
    setShowApproval(false)
    setExtraMessages((prev) => [
      ...prev,
      createUserMessage('Approve & send'),
      {
        id: `msg-approved-${Date.now()}`,
        role: 'assistant',
        content: 'Message sent to Michael Chen. Activity recorded on Chen Residence deal.',
        timestamp: new Date().toISOString(),
        links: [
          { label: 'View deal', href: '/deals/PHB-2026-00138' },
          { label: 'View agent activity', href: '/ai/activity' },
        ],
      },
    ])
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {showApproval && agentRun?.pendingApproval && (
        <AgentApprovalGate
          approval={agentRun.pendingApproval}
          onApprove={handleApprove}
          onCancel={() => {
            setShowApproval(false)
            setAgentRun(null)
          }}
        />
      )}

      <AiCopilot
        appendedMessages={extraMessages}
        initialPrompt={initialPrompt}
        onAgentPrompt={handleAgentPrompt}
      />
    </div>
  )
}
