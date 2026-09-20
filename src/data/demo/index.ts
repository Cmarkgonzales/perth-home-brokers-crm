export { demoClients, demoClient } from '@/data/demo/clients'
export { demoDeals, demoDeal } from '@/data/demo/deals'
export { demoLeads, demoLead } from '@/data/demo/leads'
export { demoDocuments } from '@/data/demo/documents'
export { demoActivities } from '@/data/demo/activities'
export {
  getClientById,
  getDealById,
  getLeadById,
  getDealsByClientId,
  getActiveDealForClient,
  getActivitiesByDealId,
  getDocumentsByDealId,
  getMissingDocumentsForDeal,
  getPipelineCounts,
  getActiveDealsCount,
  getNewLeadsCount,
  getAtRiskDealsCount,
  getPipelineValue,
  getAttentionItems,
  filterDealsByStage,
} from '@/data/demo/helpers'
export type { AttentionItem, PipelineStageCount } from '@/data/demo/helpers'
