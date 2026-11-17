import type { CommissionSummary } from '@/domain/commissions/commission.types'
import type { Deal, DealStage } from '@/domain/deals/deal.types'
import { getStageIndex } from '@/domain/deals/deal-stage'
import {
  DASHBOARD_PIPELINE_GROUPS,
  getPipelineGroupForStage,
} from '@/domain/deals/pipeline-groups'
import type {
  BookHealthCounts,
  BrokerWorkloadRow,
  ComingUpItem,
  DashboardBookHealth,
  DashboardBriefing,
  DashboardEnquiryRow,
  DashboardMoneyMetric,
  DashboardOperationsSnapshot,
  DonutSlice,
  StalledDealRow,
  StalledDealSeverity,
} from '@/domain/dashboard/dashboard.types'
import type { Lead } from '@/domain/leads/lead.types'
import type {
  DealPackageConfig,
  HouseDesign,
  LandLot,
} from '@/domain/packages/package.types'
import { formatCompactCurrency, formatCurrency } from '@/lib/formatting'

const DONUT_COLORS: Record<string, string> = {
  new: '#8A8A87',
  finance: '#357ABD',
  package: '#D98B00',
  build: '#626262',
  settlement: '#168A5B',
}

const FINANCE_STAGES: DealStage[] = ['qualified', 'finance']
const PACKAGE_STAGES: DealStage[] = ['land', 'builder', 'package']
const BUILD_STAGES: DealStage[] = ['drafting', 'approval', 'construction']

export interface BuildDashboardSnapshotInput {
  greetingName: string
  deals: Deal[]
  leads: Lead[]
  commissionSummary: CommissionSummary
  packageConfigs: DealPackageConfig[]
  designs: HouseDesign[]
  landLots: LandLot[]
  monthlySettlements: { month: string; count: number }[]
  briefing: DashboardBriefing
  stageLabels: Record<DealStage, string>
}

export function isUrgentDueLabel (dueLabel: string): boolean {
  const normalized = dueLabel.trim().toLowerCase()
  if (normalized === 'today' || normalized === 'overdue') return true
  return normalized.endsWith('ago')
}

export function classifyStalledSeverity (dueLabel: string): StalledDealSeverity {
  return isUrgentDueLabel(dueLabel) ? 'Urgent' : 'High'
}

function countByStages (deals: Deal[], stages: DealStage[]): number {
  const set = new Set(stages)
  return deals.filter((deal) => set.has(deal.stage)).length
}

export function countDealsPastFinance (deals: Deal[]): number {
  const financeIndex = getStageIndex('finance')
  return deals.filter(
    (deal) =>
      deal.stage !== 'settlement' && getStageIndex(deal.stage) > financeIndex
  ).length
}

export function buildDonutSlices (deals: Deal[]): DonutSlice[] {
  const counts = new Map<string, number>()

  for (const group of DASHBOARD_PIPELINE_GROUPS) {
    counts.set(group.id, 0)
  }

  for (const deal of deals) {
    const group = getPipelineGroupForStage(deal.stage)
    counts.set(group.id, (counts.get(group.id) ?? 0) + 1)
  }

  const financeCount =
    (counts.get('qualified') ?? 0) + (counts.get('finance') ?? 0)

  const slices: DonutSlice[] = [
    {
      id: 'new',
      label: 'New',
      count: counts.get('new') ?? 0,
      color: DONUT_COLORS.new,
    },
    {
      id: 'finance',
      label: 'Finance',
      count: financeCount,
      color: DONUT_COLORS.finance,
    },
    {
      id: 'package',
      label: 'Package',
      count: counts.get('package') ?? 0,
      color: DONUT_COLORS.package,
    },
    {
      id: 'build',
      label: 'Build',
      count: counts.get('build') ?? 0,
      color: DONUT_COLORS.build,
    },
    {
      id: 'settlement',
      label: 'Settlement',
      count: counts.get('settlement') ?? 0,
      color: DONUT_COLORS.settlement,
    },
  ]

  return slices.filter((slice) => slice.count > 0)
}

function duePriority (dueLabel: string): number {
  if (isUrgentDueLabel(dueLabel)) return 0
  if (dueLabel === 'Today') return 1
  return 2
}

function pickNearestDueLabel (deals: Deal[]): string {
  if (deals.length === 0) return '—'
  const sorted = [...deals].sort((a, b) => {
    const priority = duePriority(a.nextActionDue) - duePriority(b.nextActionDue)
    if (priority !== 0) return priority
    return a.nextActionDue.localeCompare(b.nextActionDue)
  })
  return sorted[0]?.nextActionDue ?? '—'
}

function resolvePackageLine (
  config: DealPackageConfig,
  designs: HouseDesign[],
  landLots: LandLot[]
): string | undefined {
  const design = designs.find((item) => item.id === config.designId)
  const land = landLots.find((item) => item.id === config.landId)
  if (!design || !land) return undefined
  return `${design.name} · ${land.suburb}`
}

export function buildDashboardSnapshot (
  input: BuildDashboardSnapshotInput
): DashboardOperationsSnapshot {
  const {
    greetingName,
    deals,
    leads,
    commissionSummary,
    packageConfigs,
    designs,
    landLots,
    monthlySettlements,
    briefing,
    stageLabels,
  } = input

  const activeDeals = deals.filter((deal) => deal.stage !== 'settlement')
  const settlementDeals = deals.filter((deal) => deal.stage === 'settlement')
  const atRiskDeals = deals.filter((deal) => deal.atRisk)
  const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0)

  const money: DashboardMoneyMetric[] = [
    {
      id: 'settlements-due',
      label: 'Settlements due',
      primaryValue: String(settlementDeals.length),
      secondaryValue: formatCompactCurrency(
        settlementDeals.reduce((sum, deal) => sum + deal.value, 0)
      ),
      href: '/deals?stage=settlement',
    },
    {
      id: 'expected-commission',
      label: 'Expected commission',
      primaryValue: formatCompactCurrency(commissionSummary.expected),
      hint: commissionSummary.period,
      href: '/commissions',
    },
    {
      id: 'active-pipeline',
      label: 'Active pipeline',
      primaryValue: formatCompactCurrency(pipelineValue),
      hint: `${activeDeals.length} deals`,
      href: '/deals',
    },
    {
      id: 'blocked',
      label: 'Blocked',
      primaryValue: String(atRiskDeals.length),
      hint: atRiskDeals.length === 1 ? 'deal at risk' : 'deals at risk',
      href: '/deals?risk=1',
      warning: atRiskDeals.length > 0,
    },
  ]

  const stalledDeals: StalledDealRow[] = atRiskDeals
    .map((deal) => ({
      dealId: deal.id,
      reference: deal.id,
      dealName: deal.name,
      stageLabel: stageLabels[deal.stage],
      owner: deal.owner,
      dueLabel: deal.nextActionDue,
      blocker: deal.nextAction,
      severity: classifyStalledSeverity(deal.nextActionDue),
      href: `/deals/${deal.id}`,
    }))
    .sort((a, b) => {
      const severity =
        (a.severity === 'Urgent' ? 0 : 1) - (b.severity === 'Urgent' ? 0 : 1)
      if (severity !== 0) return severity
      return a.dealName.localeCompare(b.dealName)
    })

  const newLeads = leads.filter((lead) => lead.status === 'New')
  const enquiries: DashboardEnquiryRow[] = newLeads.slice(0, 3).map((lead) => ({
    leadId: lead.id,
    name: lead.name,
    line: `${lead.source} · ${formatCurrency(lead.budget)}`,
    href: `/leads/${lead.id}`,
  }))

  const packageDealsWithConfig = deals.filter(
    (deal) =>
      (deal.stage === 'package' || PACKAGE_STAGES.includes(deal.stage)) &&
      packageConfigs.some((config) => config.dealId === deal.id)
  )

  const comingUpCandidates = [
    ...settlementDeals,
    ...packageDealsWithConfig.filter((deal) => deal.stage !== 'settlement'),
  ]

  const comingUp: ComingUpItem[] = comingUpCandidates.slice(0, 3).map((deal) => {
    const config = packageConfigs.find((item) => item.dealId === deal.id)
    return {
      dealId: deal.id,
      title: deal.name,
      valueLabel: formatCompactCurrency(deal.value),
      dueLabel: deal.nextActionDue,
      packageLine: config
        ? resolvePackageLine(config, designs, landLots)
        : undefined,
      href: `/deals/${deal.id}`,
    }
  })

  const counts: BookHealthCounts = {
    activeDeals: activeDeals.length,
    inFinance: countByStages(deals, FINANCE_STAGES),
    inPackage: countByStages(deals, PACKAGE_STAGES),
    inBuild: countByStages(deals, BUILD_STAGES),
  }

  const pastFinance = countDealsPastFinance(deals)
  const pastFinancePercent =
    activeDeals.length === 0
      ? 0
      : Math.round((pastFinance / activeDeals.length) * 100)

  const donutSlices = buildDonutSlices(deals)
  const donutTotal = deals.length

  const book: DashboardBookHealth = {
    counts,
    pastFinancePercent,
    pastFinanceLabel: `${pastFinance} of ${activeDeals.length} past finance`,
    donutSlices,
    donutTotal,
    delayedCount: atRiskDeals.length,
    monthlySettlements,
  }

  const openDeals = deals.filter((deal) => deal.stage !== 'settlement')
  const owners = [...new Set(openDeals.map((deal) => deal.owner))].sort()
  const brokers: BrokerWorkloadRow[] = owners.map((owner) => {
    const ownerDeals = openDeals.filter((deal) => deal.owner === owner)
    return {
      owner,
      openFiles: ownerDeals.length,
      nextDueLabel: pickNearestDueLabel(ownerDeals),
    }
  })

  return {
    periodLabel: commissionSummary.period,
    greetingName,
    money,
    stalledDeals,
    enquiries,
    newEnquiriesTotal: newLeads.length,
    comingUp,
    book,
    brokers,
    briefing,
  }
}