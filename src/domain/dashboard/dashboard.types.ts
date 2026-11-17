import type { DashboardPipelineGroupId } from '@/domain/deals/pipeline-groups'

export type AttentionSeverity = 'high' | 'medium' | 'low'
export type AttentionAction = 'Review' | 'Open'

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

export interface DashboardBriefing {
  headline: string
  overdueApprovals: number
  missingDocuments: number
  criticalCount: number
  prompt: string
}

export type DashboardMoneyMetricId =
  | 'settlements-due'
  | 'expected-commission'
  | 'active-pipeline'
  | 'blocked'

export interface DashboardMoneyMetric {
  id: DashboardMoneyMetricId
  label: string
  primaryValue: string
  secondaryValue?: string
  hint?: string
  href: string
  warning?: boolean
}

export type StalledDealSeverity = 'Urgent' | 'High'

export interface StalledDealRow {
  dealId: string
  reference: string
  dealName: string
  stageLabel: string
  owner: string
  dueLabel: string
  blocker: string
  severity: StalledDealSeverity
  href: string
}

export interface DashboardEnquiryRow {
  leadId: string
  name: string
  line: string
  href: string
}

export interface ComingUpItem {
  dealId: string
  title: string
  valueLabel: string
  dueLabel: string
  packageLine?: string
  href: string
}

export interface BookHealthCounts {
  activeDeals: number
  inFinance: number
  inPackage: number
  inBuild: number
}

export interface DonutSlice {
  id: string
  label: string
  count: number
  /** CSS color for donut segment */
  color: string
}

export interface BrokerWorkloadRow {
  owner: string
  openFiles: number
  nextDueLabel: string
}

export interface DashboardBookHealth {
  counts: BookHealthCounts
  pastFinancePercent: number
  pastFinanceLabel: string
  donutSlices: DonutSlice[]
  donutTotal: number
  delayedCount: number
  monthlySettlements: { month: string; count: number }[]
}

export interface DashboardOperationsSnapshot {
  periodLabel: string
  greetingName: string
  money: DashboardMoneyMetric[]
  stalledDeals: StalledDealRow[]
  enquiries: DashboardEnquiryRow[]
  newEnquiriesTotal: number
  comingUp: ComingUpItem[]
  book: DashboardBookHealth
  brokers: BrokerWorkloadRow[]
  briefing: DashboardBriefing
}