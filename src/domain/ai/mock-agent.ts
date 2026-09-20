import type { AgentRun, PendingApproval } from '@/domain/ai/agent.types'

export function createBriefingAgentRun (): AgentRun {
  return {
    id: 'run-briefing-001',
    trigger: 'Prepare my morning briefing',
    startedAt: new Date().toISOString(),
    status: 'running',
    steps: [
      {
        id: 'step-1',
        label: 'Gather pipeline data',
        status: 'pending',
        toolCalls: [
          { id: 'tc-1', tool: 'get_pipeline()', status: 'pending' },
          { id: 'tc-2', tool: 'get_overdue_tasks()', status: 'pending' },
          { id: 'tc-3', tool: 'get_stale_deals()', status: 'pending' },
          { id: 'tc-4', tool: 'get_pending_approvals()', status: 'pending' },
          { id: 'tc-5', tool: 'get_missing_documents()', status: 'pending' },
        ],
      },
      {
        id: 'step-2',
        label: 'Reason over CRM context',
        status: 'pending',
      },
      {
        id: 'step-3',
        label: 'Generate prioritized briefing',
        status: 'pending',
      },
    ],
  }
}

export function createFollowUpAgentRun (): AgentRun {
  const pendingApproval: PendingApproval = {
    id: 'approval-msg-001',
    type: 'message',
    title: 'Follow-up for Michael Chen',
    preview:
      'Hi Michael, I wanted to follow up on the builder quote for your Baldivis package. Our admin team is reviewing the approval and I expect an update within 24 hours. Please let me know if you have any questions.',
    recipient: 'Michael Chen',
    dealId: 'PHB-2026-00138',
  }

  return {
    id: 'run-followup-001',
    trigger: "Draft a follow-up for Michael Chen's overdue approval",
    startedAt: new Date().toISOString(),
    status: 'running',
    steps: [
      {
        id: 'step-1',
        label: 'Load deal and approval context',
        status: 'pending',
        toolCalls: [
          { id: 'tc-1', tool: 'get_deal("PHB-2026-00138")', status: 'pending' },
          { id: 'tc-2', tool: 'get_pending_approvals()', status: 'pending' },
        ],
      },
      {
        id: 'step-2',
        label: 'Draft follow-up message',
        status: 'pending',
        toolCalls: [
          { id: 'tc-3', tool: 'draft_message()', status: 'pending' },
        ],
      },
      {
        id: 'step-3',
        label: 'Await human approval',
        status: 'pending',
      },
    ],
    pendingApproval,
  }
}

export function createLeadQualificationAgentRun (leadName: string): AgentRun {
  return {
    id: 'run-lead-001',
    trigger: `AI qualify lead: ${leadName}`,
    startedAt: new Date().toISOString(),
    status: 'running',
    steps: [
      {
        id: 'step-1',
        label: 'Gather lead profile',
        status: 'pending',
        toolCalls: [
          { id: 'tc-1', tool: 'get_lead()', status: 'pending' },
        ],
      },
      {
        id: 'step-2',
        label: 'Check finance readiness',
        status: 'pending',
        toolCalls: [
          { id: 'tc-2', tool: 'get_documents()', status: 'pending' },
        ],
      },
      {
        id: 'step-3',
        label: 'Recommend next action',
        status: 'pending',
      },
    ],
  }
}

export function createDocumentAgentRun (documentName: string): AgentRun {
  return {
    id: 'run-doc-001',
    trigger: `Process document: ${documentName}`,
    startedAt: new Date().toISOString(),
    status: 'running',
    steps: [
      {
        id: 'step-1',
        label: 'Extract document fields',
        status: 'pending',
        toolCalls: [
          { id: 'tc-1', tool: 'extract_document()', status: 'pending' },
        ],
      },
      {
        id: 'step-2',
        label: 'Validate against deal records',
        status: 'pending',
        toolCalls: [
          { id: 'tc-2', tool: 'validate_document()', status: 'pending' },
        ],
      },
      {
        id: 'step-3',
        label: 'Flag for manual review',
        status: 'pending',
      },
    ],
  }
}

export function advanceAgentRun (run: AgentRun, stepIndex: number): AgentRun {
  const steps = run.steps.map((step, index) => {
    if (index < stepIndex) {
      return {
        ...step,
        status: 'complete' as const,
        toolCalls: step.toolCalls?.map((tc) => ({
          ...tc,
          status: 'complete' as const,
          resultSummary: 'OK',
        })),
      }
    }
    if (index === stepIndex) {
      return { ...step, status: 'running' as const }
    }
    return step
  })

  const allComplete = stepIndex >= run.steps.length
  const awaitingApproval =
    run.pendingApproval && stepIndex >= run.steps.length - 1

  return {
    ...run,
    steps,
    status: allComplete
      ? awaitingApproval
        ? 'awaiting_approval'
        : 'complete'
      : 'running',
    completedAt: allComplete && !awaitingApproval ? new Date().toISOString() : undefined,
    outcome: allComplete && !awaitingApproval
      ? 'Agent run completed successfully.'
      : undefined,
  }
}

export function completeAgentRun (run: AgentRun): AgentRun {
  return {
    ...run,
    status: 'complete',
    completedAt: new Date().toISOString(),
    pendingApproval: undefined,
    outcome: 'Message sent and activity recorded.',
    steps: run.steps.map((step) => ({
      ...step,
      status: 'complete',
      toolCalls: step.toolCalls?.map((tc) => ({
        ...tc,
        status: 'complete',
        resultSummary: 'OK',
      })),
    })),
  }
}

export function matchAgentRunType (prompt: string): 'briefing' | 'followup' | null {
  if (/briefing|morning/i.test(prompt)) return 'briefing'
  if (/michael|follow.?up|overdue approval/i.test(prompt)) return 'followup'
  return null
}
