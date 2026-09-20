export { demoClients, demoClient } from '@/data/demo/clients'
export { demoDeals, demoDeal } from '@/data/demo/deals'
export { demoLeads, demoLead } from '@/data/demo/leads'
export { demoDocuments } from '@/data/demo/documents'
export { demoActivities } from '@/data/demo/activities'
export { demoApprovals } from '@/data/demo/approvals'
export { demoTasks } from '@/data/demo/tasks'
export { demoCommunications } from '@/data/demo/communications'
export {
  demoLandLots,
  demoHouseDesigns,
  demoPackageExtras,
  demoPackageConfigs,
  calculatePackageTotal,
  estimateRepayment,
} from '@/data/demo/packages'
export {
  getClientById,
  getDealById,
  getLeadById,
  getDealsByClientId,
  getActiveDealForClient,
  getActivitiesByDealId,
  getDocumentsByDealId,
  getMissingDocumentsForDeal,
  getDocumentById,
  getTasksByDealId,
  getOpenTasks,
  getApprovalById,
  getPendingApprovals,
  getApprovalsByDealId,
  getPackageConfigForDeal,
  getCommunicationsByClientId,
  getDocumentsGroupedByDeal,
  getPipelineCounts,
  getActiveDealsCount,
  getNewLeadsCount,
  getAtRiskDealsCount,
  getPipelineValue,
  getAttentionItems,
  filterDealsByStage,
} from '@/data/demo/helpers'
export type {
  AttentionItem,
  PipelineStageCount,
  DocumentsByDeal,
} from '@/data/demo/helpers'
