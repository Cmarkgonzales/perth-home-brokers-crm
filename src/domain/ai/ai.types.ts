export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  links?: AiLink[]
  sections?: AiResponseSection[]
}

export interface AiLink {
  label: string
  href: string
}

export interface AiResponseSection {
  title: string
  items: string[]
  severity?: 'critical' | 'warning' | 'info'
}

export interface AiSuggestion {
  id: string
  label: string
  prompt: string
}

export interface AiBriefing {
  headline: string
  overdueApprovals: number
  missingDocuments: number
  criticalCount: number
  prompt: string
  items: {
    text: string
    severity?: 'critical' | 'warning' | 'info'
  }[]
}

export type LeadFollowUpChannel = 'call' | 'sms' | 'email'

export interface LeadAssessment {
  leadId: string
  leadName: string
  intent: 'High' | 'Medium' | 'Low'
  estimatedBudget: number
  timeline: string
  financeRisk: 'Low' | 'Medium' | 'High'
  summary: string
  recommendedAction: string
  recommendedChannel: LeadFollowUpChannel
}

export interface DocumentCheckResult {
  documentId: string
  documentName: string
  status: 'ok' | 'review' | 'mismatch'
  extractedFields: { label: string; value: string }[]
  issue?: string
}

export interface ApprovalAiSummary {
  approvalId: string
  summary: string
  budgetFit: boolean
  missingDocuments: string[]
}

export interface DealAiInsight {
  dealId: string
  insight: string
  suggestedNextStep?: string
  nextActions: string[]
}
