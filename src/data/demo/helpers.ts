import type { AttentionItem } from '@/domain/dashboard/dashboard.types'
import type { DashboardPipelineColumn } from '@/domain/dashboard/dashboard.types'
import type { Deal, DealStage } from '@/domain/deals/deal.types'
import { DEAL_STAGES } from '@/domain/deals/deal-stage'
import {
  DASHBOARD_PIPELINE_GROUPS,
  getPipelineGroupById,
  groupDealsByPipelineGroup,
  isDashboardPipelineGroupId,
  type DashboardPipelineGroupId,
} from '@/domain/deals/pipeline-groups'
import type { LeadStatus } from '@/domain/leads/lead.types'
import { searchCrm } from '@/domain/search/search-crm'
import { demoActivities } from '@/data/demo/activities'
import { demoApprovals } from '@/data/demo/approvals'
import { demoClients } from '@/data/demo/clients'
import { demoCommunications } from '@/data/demo/communications'
import { demoDeals } from '@/data/demo/deals'
import { demoDocuments } from '@/data/demo/documents'
import { demoLeads } from '@/data/demo/leads'
import { demoPackageConfigs } from '@/data/demo/packages'
import { demoTasks } from '@/data/demo/tasks'
import { DEMO_TODAY } from '@/lib/constants'
import {
  daysBetween,
  formatIdleLabel,
  formatWaitingLabel,
} from '@/lib/formatting'

export type { AttentionItem } from '@/domain/dashboard/dashboard.types'

export interface PipelineStageCount {
  stage: DealStage
  count: number
}

const STALE_ACTIVITY_DAYS = 5
const MAX_ATTENTION_ITEMS = 7

export interface DocumentsByDeal {
  dealId: string
  dealName: string
  clientName: string
  documents: typeof demoDocuments
  missingCount: number
}

export function getClientById (id: string) {
  return demoClients.find((client) => client.id === id)
}

export function getDealById (id: string) {
  return demoDeals.find((deal) => deal.id === id)
}

export function getLeadById (id: string) {
  return demoLeads.find((lead) => lead.id === id)
}

export function getDealsByClientId (clientId: string) {
  return demoDeals.filter((deal) => deal.clientId === clientId)
}

export function getActiveDealForClient (clientId: string) {
  const clientDeals = getDealsByClientId(clientId)
  return clientDeals.find((deal) => deal.stage !== 'settlement') ?? clientDeals[0]
}

export function getActivitiesByDealId (dealId: string) {
  return demoActivities
    .filter((activity) => activity.dealId === dealId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getDocumentsByDealId (dealId: string) {
  return demoDocuments.filter((doc) => doc.dealId === dealId)
}

export function getMissingDocumentsForDeal (dealId: string) {
  return getDocumentsByDealId(dealId).filter((doc) => doc.status === 'missing')
}

export function getDocumentById (id: string) {
  return demoDocuments.find((doc) => doc.id === id)
}

export function getTasksByDealId (dealId: string) {
  return demoTasks.filter((task) => task.dealId === dealId)
}

export function getOpenTasks () {
  return demoTasks.filter((task) => task.status === 'open')
}

export function getApprovalById (id: string) {
  return demoApprovals.find((approval) => approval.id === id)
}

export function getPendingApprovals () {
  return demoApprovals.filter((approval) => approval.status === 'pending')
}

export function isDueDateOverdue (dueDate: string, today = DEMO_TODAY): boolean {
  return dueDate < today
}

export function getOverdueApprovals () {
  return getPendingApprovals().filter((approval) =>
    isDueDateOverdue(approval.dueDate)
  )
}

export function getOverdueApprovalCount (): number {
  return getOverdueApprovals().length
}

export function getMissingRequiredDocumentCount (): number {
  return demoDocuments.filter(
    (doc) => doc.required && doc.status === 'missing'
  ).length
}

export function getApprovalsByDealId (dealId: string) {
  return demoApprovals.filter((approval) => approval.dealId === dealId)
}

export function getPackageConfigForDeal (dealId: string) {
  return demoPackageConfigs.find((pkg) => pkg.dealId === dealId)
}

export function getCommunicationsByClientId (clientId: string) {
  return demoCommunications
    .filter((comm) => comm.clientId === clientId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getDocumentsGroupedByDeal (): DocumentsByDeal[] {
  const dealIds = [...new Set(demoDocuments.map((doc) => doc.dealId))]

  return dealIds.map((dealId) => {
    const deal = getDealById(dealId)
    const client = deal ? getClientById(deal.clientId) : undefined
    const documents = getDocumentsByDealId(dealId)

    return {
      dealId,
      dealName: deal?.name ?? dealId,
      clientName: client?.name ?? 'Unknown client',
      documents,
      missingCount: documents.filter((doc) => doc.status === 'missing').length,
    }
  })
}

export function getPipelineCounts (): PipelineStageCount[] {
  const counts = new Map<DealStage, number>()

  for (const deal of demoDeals) {
    counts.set(deal.stage, (counts.get(deal.stage) ?? 0) + 1)
  }

  return DEAL_STAGES.filter((stage) => (counts.get(stage) ?? 0) > 0).map(
    (stage) => ({
      stage,
      count: counts.get(stage) ?? 0,
    })
  )
}

export function getActiveDealsCount (): number {
  return demoDeals.filter((deal) => deal.stage !== 'settlement').length
}

export function getNewLeadsCount (): number {
  return demoLeads.filter((lead) => lead.status === 'New').length
}

export function getAtRiskDealsCount (): number {
  return demoDeals.filter((deal) => deal.atRisk).length
}

export function getPipelineValue (): number {
  return demoDeals
    .filter((deal) => deal.stage !== 'settlement')
    .reduce((sum, deal) => sum + deal.value, 0)
}

export function getPipelineGroupCounts (): DashboardPipelineColumn[] {
  const counts = new Map<DealStage, number>()

  for (const deal of demoDeals) {
    counts.set(deal.stage, (counts.get(deal.stage) ?? 0) + 1)
  }

  return DASHBOARD_PIPELINE_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    count: group.stages.reduce(
      (sum, stage) => sum + (counts.get(stage) ?? 0),
      0
    ),
    href: `/deals?group=${group.id}`,
  }))
}

export type DealBoardFlagTone = 'warning' | 'danger'

export interface DealBoardFlag {
  label: string
  tone: DealBoardFlagTone
}

export interface DealBoardCard {
  deal: Deal
  clientName: string
  ownerInitial: string
  flag: DealBoardFlag | null
}

export interface DealBoardColumn {
  id: DashboardPipelineGroupId
  label: string
  deals: DealBoardCard[]
}

export function getDealBoardFlag (deal: Deal): DealBoardFlag | null {
  const hasOverdueApproval = getApprovalsByDealId(deal.id).some(
    (approval) =>
      approval.status === 'pending' && isDueDateOverdue(approval.dueDate)
  )

  if (hasOverdueApproval) {
    return { label: 'Approval overdue', tone: 'warning' }
  }

  if (getMissingDocumentsForDeal(deal.id).length > 0) {
    return { label: 'Documents missing', tone: 'warning' }
  }

  const latestActivity = getLatestActivityDate(deal.id)
  const idleDays = latestActivity
    ? daysBetween(latestActivity, DEMO_TODAY)
    : STALE_ACTIVITY_DAYS + 1

  if (idleDays >= STALE_ACTIVITY_DAYS) {
    return { label: formatIdleLabel(idleDays), tone: 'warning' }
  }

  if (deal.atRisk) {
    return { label: deal.nextAction, tone: 'warning' }
  }

  return null
}

export function getDealBoardColumns (deals: Deal[]): DealBoardColumn[] {
  return groupDealsByPipelineGroup(deals).map((group) => ({
    id: group.id,
    label: group.label,
    deals: group.deals.map((deal) => ({
      deal,
      clientName: getClientNameForDeal(deal),
      ownerInitial: deal.owner.charAt(0).toUpperCase(),
      flag: getDealBoardFlag(deal),
    })),
  }))
}

function getClientNameForDeal (deal: Deal): string {
  return getClientById(deal.clientId)?.name ?? deal.name
}

function getLatestActivityDate (dealId: string): string | undefined {
  return getActivitiesByDealId(dealId)[0]?.date
}

function getMissingDocumentWaitDays (
  dealId: string,
  missingNames: string[]
): number {
  const activities = getActivitiesByDealId(dealId)
  const related = activities.find((activity) =>
    missingNames.some((name) => {
      const haystack = `${activity.title} ${activity.description}`.toLowerCase()
      return haystack.includes(name.toLowerCase())
    })
  )

  if (related) return daysBetween(related.date, DEMO_TODAY)

  const latest = activities[0]
  return latest ? daysBetween(latest.date, DEMO_TODAY) : 0
}

function severityRank (severity: AttentionItem['severity']): number {
  if (severity === 'high') return 0
  if (severity === 'medium') return 1
  return 2
}

export function getAttentionItems (): AttentionItem[] {
  const items: AttentionItem[] = []
  const coveredDealIds = new Set<string>()
  const coveredClientKeys = new Set<string>()

  function claimClient (key: string): boolean {
    if (coveredClientKeys.has(key)) return false
    coveredClientKeys.add(key)
    return true
  }

  for (const approval of getOverdueApprovals()) {
    const deal = getDealById(approval.dealId)
    const clientKey = deal?.clientId ?? approval.clientName
    if (!claimClient(clientKey)) continue

    const waitingDays = daysBetween(approval.requestedAt, DEMO_TODAY)
    const description =
      approval.type === 'builder'
        ? 'Builder quote approval is overdue'
        : approval.type === 'finance'
          ? 'Finance approval is overdue'
          : 'Land contract approval is overdue'

    items.push({
      id: `att-approval-${approval.id}`,
      clientName: approval.clientName,
      description,
      href: `/approvals/${approval.id}`,
      severity: 'high',
      meta: formatWaitingLabel(waitingDays),
      actionLabel: 'Review',
    })
    coveredDealIds.add(approval.dealId)
  }

  for (const deal of demoDeals) {
    if (coveredDealIds.has(deal.id)) continue
    const missing = getMissingDocumentsForDeal(deal.id)
    if (missing.length === 0) continue
    if (!claimClient(deal.clientId)) continue

    const names = missing.map((doc) => doc.name.toLowerCase()).join(' and ')
    const waitingDays = getMissingDocumentWaitDays(
      deal.id,
      missing.map((doc) => doc.name)
    )

    items.push({
      id: `att-docs-${deal.id}`,
      clientName: getClientNameForDeal(deal),
      description:
        missing.length === 1
          ? `Finance documents incomplete: ${names} missing`
          : `Required documents incomplete: ${names} missing`,
      href: `/deals/${deal.id}`,
      severity: 'high',
      meta: formatWaitingLabel(waitingDays),
      actionLabel: 'Open',
    })
    coveredDealIds.add(deal.id)
  }

  for (const deal of demoDeals) {
    if (coveredDealIds.has(deal.id) || deal.stage === 'settlement') continue

    const latestActivity = getLatestActivityDate(deal.id)
    const idleDays = latestActivity
      ? daysBetween(latestActivity, DEMO_TODAY)
      : STALE_ACTIVITY_DAYS + 1
    const isStale = idleDays >= STALE_ACTIVITY_DAYS
    const nextActionOverdue =
      deal.nextActionDue.toLowerCase().includes('ago') ||
      deal.nextActionDue.toLowerCase() === 'overdue'

    if (!deal.atRisk && !isStale && !nextActionOverdue) continue
    if (!claimClient(deal.clientId)) continue

    items.push({
      id: `att-deal-${deal.id}`,
      clientName: getClientNameForDeal(deal),
      description: isStale
        ? formatIdleLabel(idleDays)
        : deal.nextAction,
      href: `/deals/${deal.id}`,
      severity: deal.atRisk ? 'high' : 'medium',
      meta: `Owner: ${deal.owner}`,
      actionLabel: 'Open',
    })
    coveredDealIds.add(deal.id)
  }

  for (const lead of demoLeads) {
    if (lead.status !== 'New') continue
    const clientKey = lead.clientId ?? lead.id
    if (!claimClient(clientKey)) continue

    items.push({
      id: `att-lead-${lead.id}`,
      clientName: lead.name,
      description: 'New enquiry awaiting first contact',
      href: `/leads/${lead.id}`,
      severity: 'medium',
      meta: `Owner: ${lead.owner}`,
      actionLabel: 'Open',
    })
  }

  return items
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .slice(0, MAX_ATTENTION_ITEMS)
}

export function filterDealsByStage (stage?: DealStage) {
  if (!stage || !DEAL_STAGES.includes(stage)) return demoDeals
  return demoDeals.filter((deal) => deal.stage === stage)
}

export function filterDeals (options: {
  stage?: DealStage
  group?: string
  atRisk?: boolean
}): Deal[] {
  let deals = demoDeals

  if (options.group && isDashboardPipelineGroupId(options.group)) {
    const group = getPipelineGroupById(options.group)
    const stages = group.stages as readonly DealStage[]
    deals = deals.filter((deal) => stages.includes(deal.stage))
  } else if (options.stage) {
    deals = filterDealsByStage(options.stage)
  }

  if (options.atRisk) {
    deals = deals.filter((deal) => deal.atRisk)
  }

  return deals
}

export function filterLeadsByStatus (status?: string) {
  if (!status) return demoLeads
  return demoLeads.filter((lead) => lead.status === status)
}

export function isLeadStatus (value: string): value is LeadStatus {
  return ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].includes(value)
}

export function searchCrmRecords (query: string) {
  return searchCrm({
    query,
    leads: demoLeads,
    clients: demoClients,
    deals: demoDeals,
  })
}
