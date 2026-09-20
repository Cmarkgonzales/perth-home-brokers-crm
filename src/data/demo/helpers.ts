import type { DealStage } from '@/domain/deals/deal.types'
import { DEAL_STAGES } from '@/domain/deals/deal-stage'
import { demoActivities } from '@/data/demo/activities'
import { demoApprovals } from '@/data/demo/approvals'
import { demoClients } from '@/data/demo/clients'
import { demoCommunications } from '@/data/demo/communications'
import { demoDeals } from '@/data/demo/deals'
import { demoDocuments } from '@/data/demo/documents'
import { demoLeads } from '@/data/demo/leads'
import { demoPackageConfigs } from '@/data/demo/packages'
import { demoTasks } from '@/data/demo/tasks'

export interface PipelineStageCount {
  stage: DealStage
  count: number
}

export interface AttentionItem {
  id: string
  title: string
  description: string
  href: string
  severity: 'high' | 'medium' | 'low'
}

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
  return demoTasks.filter(
    (task) => task.dealId === dealId && task.status === 'open'
  )
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

export function getAttentionItems (): AttentionItem[] {
  return [
    {
      id: 'att-001',
      title: 'Williams — missing bank statement',
      description: 'Finance approval blocked until bank statement is uploaded.',
      href: '/deals/PHB-2026-00142',
      severity: 'high',
    },
    {
      id: 'att-002',
      title: 'Chen — builder quote approval overdue',
      description: 'Builder quote has been pending review for 4 days.',
      href: '/approvals/appr-002',
      severity: 'high',
    },
    {
      id: 'att-003',
      title: 'Smith — inactive lead',
      description: 'No contact activity in 13 days. Schedule follow-up.',
      href: '/clients/client-003',
      severity: 'medium',
    },
  ]
}

export function filterDealsByStage (stage?: DealStage) {
  if (!stage || !DEAL_STAGES.includes(stage)) return demoDeals
  return demoDeals.filter((deal) => deal.stage === stage)
}
