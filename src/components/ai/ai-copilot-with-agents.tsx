'use client'

import { useState } from 'react'
import type { AgentRun } from '@/domain/ai/agent.types'
import type { AiMessage } from '@/domain/ai/ai.types'
import {
  completeAgentRun,
  createBriefingAgentRun,
  createFollowUpAgentRun,
  matchAgentRunType,
} from '@/domain/ai/mock-agent'
import { generateResponse, createUserMessage } from '@/domain/ai/mock-copilot'
import { AiCopilot } from '@/components/ai/ai-copilot'
import { AgentTrace } from '@/components/ai/agent-trace'
import { AgentApprovalGate } from '@/components/ai/agent-approval-gate'

export function AiCopilotWithAgents () {
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null)
  const [showApproval, setShowApproval] = useState(false)
  const [extraMessages, setExtraMessages] = useState<AiMessage[]>([])

  function handleAgentPrompt (prompt: string) {
    const runType = matchAgentRunType(prompt)
    if (runType === 'briefing') {
      setAgentRun(createBriefingAgentRun())
      setShowApproval(false)
    } else if (runType === 'followup') {
      setAgentRun(createFollowUpAgentRun())
      setShowApproval(false)
    } else {
      setAgentRun(null)
      setShowApproval(false)
    }
  }

  function handleAgentComplete (run: AgentRun) {
    setAgentRun(run)
    if (run.status === 'complete') {
      const response = generateResponse(run.trigger)
      setExtraMessages((prev) => [...prev, response])
    }
  }

  function handleAwaitingApproval (run: AgentRun) {
    setAgentRun(run)
    setShowApproval(true)
  }

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
    <div className="space-y-4">
      {agentRun && agentRun.status !== 'complete' && !showApproval && (
        <AgentTrace
          key={agentRun.id}
          run={agentRun}
          onComplete={handleAgentComplete}
          onAwaitingApproval={handleAwaitingApproval}
        />
      )}

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
        onAgentPrompt={handleAgentPrompt}
      />
    </div>
  )
}
