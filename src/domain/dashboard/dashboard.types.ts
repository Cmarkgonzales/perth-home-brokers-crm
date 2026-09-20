import type { DashboardPipelineGroupId } from '@/domain/deals/pipeline-groups'

export type AttentionSeverity = 'high' | 'medium' | 'low'
export type AttentionAction = 'Review' | 'Open'
export type MetricHintTone = 'positive' | 'warning' | 'neutral'

export interface AttentionItem {
  id: string
  clientName: string
  description: string
  href: string
  severity: AttentionSeverity
  meta: string
  actionLabel: AttentionAction
}

export interface DashboardPipelineColumn {
  id: DashboardPipelineGroupId
  label: string
  count: number
  href: string
}

export interface DashboardMetric {
  id: 'active-deals' | 'new-leads' | 'action-required' | 'pipeline-value'
  label: string
  value: string
  hint: string
  hintPeriod?: string
  hintTone: MetricHintTone
  href: string
  trend: number[]
  highlighted?: boolean
}

export interface DashboardBriefing {
  headline: string
  overdueApprovals: number
  missingDocuments: number
  criticalCount: number
  prompt: string
}

export interface DashboardSnapshot {
  greetingName: string
  metrics: DashboardMetric[]
  pipeline: DashboardPipelineColumn[]
  pipelineDealCount: number
  briefing: DashboardBriefing
  attentionItems: AttentionItem[]
  urgentCount: number
}
