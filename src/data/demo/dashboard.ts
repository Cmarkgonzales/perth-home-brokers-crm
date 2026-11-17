import {
  getAttentionItems,
  getMissingRequiredDocumentCount,
  getOverdueApprovalCount,
} from '@/data/demo/helpers'
import { getCommissionSummary } from '@/data/demo/commissions'
import { demoDeals } from '@/data/demo/deals'
import { demoLeads } from '@/data/demo/leads'
import {
  demoHouseDesigns,
  demoLandLots,
  demoPackageConfigs,
} from '@/data/demo/packages'
import { buildDashboardSnapshot } from '@/domain/dashboard/dashboard-snapshot'
import type { DashboardOperationsSnapshot } from '@/domain/dashboard/dashboard.types'
import { getMonthlySettlements } from '@/domain/reporting/pipeline-metrics'
import { CURRENT_USER, DEAL_STAGE_LABELS } from '@/lib/constants'

export function getDashboardSnapshot (): DashboardOperationsSnapshot {
  const attentionItems = getAttentionItems()
  const urgentCount = attentionItems.filter(
    (item) => item.severity === 'high'
  ).length
  const overdueApprovals = getOverdueApprovalCount()
  const missingDocuments = getMissingRequiredDocumentCount()

  return buildDashboardSnapshot({
    greetingName: CURRENT_USER.name.split(' ')[0] ?? CURRENT_USER.name,
    deals: demoDeals,
    leads: demoLeads,
    commissionSummary: getCommissionSummary(),
    packageConfigs: demoPackageConfigs,
    designs: demoHouseDesigns,
    landLots: demoLandLots,
    monthlySettlements: getMonthlySettlements(),
    briefing: {
      headline: `${attentionItems.length} deals need attention today`,
      overdueApprovals,
      missingDocuments,
      criticalCount: urgentCount,
      prompt: 'Which deals need attention today?',
    },
    stageLabels: DEAL_STAGE_LABELS,
  })
}