export type AgentStepStatus = 'pending' | 'running' | 'complete' | 'error'

export interface AgentToolCall {
  id: string
  tool: string
  status: AgentStepStatus
  resultSummary?: string
}

export interface AgentStep {
  id: string
  label: string
  status: AgentStepStatus
  toolCalls?: AgentToolCall[]
}

export interface PendingApproval {
  id: string
  type: 'message' | 'task' | 'document'
  title: string
  preview: string
  recipient?: string
  dealId?: string
}

export interface AgentRun {
  id: string
  trigger: string
  startedAt: string
  completedAt?: string
  status: 'running' | 'awaiting_approval' | 'complete' | 'cancelled'
  steps: AgentStep[]
  pendingApproval?: PendingApproval
  outcome?: string
}

export interface AgentRunRecord {
  id: string
  trigger: string
  timestamp: string
  toolsUsed: string[]
  outcome: string
  humanApproved: boolean
}
