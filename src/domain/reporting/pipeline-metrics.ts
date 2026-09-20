import { demoDeals } from '@/data/demo/deals'
import { demoLeads } from '@/data/demo/leads'
import type { DealStage } from '@/domain/deals/deal.types'
import { DEAL_STAGES } from '@/domain/deals/deal-stage'

export interface FunnelStage {
  label: string
  count: number
  stage?: DealStage
}

export interface DealCycleMetric {
  label: string
  days: number
}

export interface ReportingSnapshot {
  funnel: FunnelStage[]
  conversionRate: number
  dealCycleMetrics: DealCycleMetric[]
  monthlySettlements: { month: string; count: number }[]
}

export function getConversionFunnel (): FunnelStage[] {
  const leads = demoLeads.length + 120
  const qualified = demoLeads.filter((l) =>
    ['Qualified', 'Converted', 'Contacted'].includes(l.status)
  ).length + 84
  const finance = demoDeals.filter((d) =>
    ['finance', 'land', 'builder', 'package', 'drafting', 'approval', 'construction', 'settlement'].includes(d.stage)
  ).length + 35
  const packages = demoDeals.filter((d) =>
    ['package', 'drafting', 'approval', 'construction', 'settlement'].includes(d.stage)
  ).length + 24
  const settlements = demoDeals.filter((d) => d.stage === 'settlement').length + 41

  return [
    { label: 'Leads', count: leads },
    { label: 'Qualified', count: qualified },
    { label: 'Finance', count: finance },
    { label: 'Packages', count: packages },
    { label: 'Settlements', count: settlements },
  ]
}

export function getConversionRate (): number {
  const funnel = getConversionFunnel()
  const leads = funnel[0]?.count ?? 1
  const settlements = funnel[funnel.length - 1]?.count ?? 0
  return Math.round((settlements / leads) * 1000) / 10
}

export function getDealCycleMetrics (): DealCycleMetric[] {
  return [
    { label: 'Lead → Finance', days: 12 },
    { label: 'Finance → Package', days: 18 },
    { label: 'Package → Settlement', days: 146 },
  ]
}

export function getMonthlySettlements () {
  return [
    { month: 'Apr', count: 3 },
    { month: 'May', count: 5 },
    { month: 'Jun', count: 4 },
    { month: 'Jul', count: 6 },
    { month: 'Aug', count: 5 },
    { month: 'Sep', count: 7 },
  ]
}

export function getReportingSnapshot (): ReportingSnapshot {
  return {
    funnel: getConversionFunnel(),
    conversionRate: getConversionRate(),
    dealCycleMetrics: getDealCycleMetrics(),
    monthlySettlements: getMonthlySettlements(),
  }
}

export function getPipelineChartData () {
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
