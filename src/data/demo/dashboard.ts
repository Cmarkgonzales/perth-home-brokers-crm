import {
  getActiveDealsCount,
  getAttentionItems,
  getMissingRequiredDocumentCount,
  getNewLeadsCount,
  getOverdueApprovalCount,
  getPipelineGroupCounts,
  getPipelineValue,
} from '@/data/demo/helpers'
import type {
  DashboardMetric,
  DashboardSnapshot,
  MetricHintTone,
} from '@/domain/dashboard/dashboard.types'
import { CURRENT_USER } from '@/lib/constants'
import {
  formatCompactCurrency,
  formatCountDelta,
  formatCurrencyDelta,
} from '@/lib/formatting'

const TREND_PERIOD_LABEL = 'vs last week'

const ACTIVE_DEALS_TREND = [6, 6, 7, 6, 7, 7, 6]
const NEW_LEADS_TREND = [2, 3, 2, 3, 3, 2, 3]
const ACTION_REQUIRED_TREND = [8, 7, 8, 6, 7, 6, 7]
const PIPELINE_VALUE_TREND = [
  3_760_000, 3_810_000, 3_790_000, 3_860_000, 3_900_000, 3_940_000, 3_970_000,
]

function withCurrentValue (series: number[], current: number): number[] {
  return [...series, current]
}

function trendDelta (series: number[]): number {
  const first = series[0]
  const last = series[series.length - 1]
  if (first === undefined || last === undefined) return 0
  return last - first
}

function hintToneFromDelta (delta: number): MetricHintTone {
  if (delta > 0) return 'positive'
  return 'neutral'
}

export function getDashboardSnapshot (): DashboardSnapshot {
  const attentionItems = getAttentionItems()
  const urgentCount = attentionItems.filter(
    (item) => item.severity === 'high'
  ).length
  const overdueApprovals = getOverdueApprovalCount()
  const missingDocuments = getMissingRequiredDocumentCount()
  const pipeline = getPipelineGroupCounts()
  const pipelineDealCount = pipeline.reduce(
    (sum, column) => sum + column.count,
    0
  )
  const activeDeals = getActiveDealsCount()
  const newLeads = getNewLeadsCount()
  const pipelineValue = getPipelineValue()

  const activeTrend = withCurrentValue(ACTIVE_DEALS_TREND, activeDeals)
  const leadTrend = withCurrentValue(NEW_LEADS_TREND, newLeads)
  const actionTrend = withCurrentValue(
    ACTION_REQUIRED_TREND,
    attentionItems.length
  )
  const valueTrend = withCurrentValue(PIPELINE_VALUE_TREND, pipelineValue)

  const activeDelta = trendDelta(activeTrend)
  const leadDelta = trendDelta(leadTrend)
  const pipelineDelta = trendDelta(valueTrend)

  const metrics: DashboardMetric[] = [
    {
      id: 'active-deals',
      label: 'Active deals',
      value: String(activeDeals),
      hint: formatCountDelta(activeDelta, 'deal'),
      hintPeriod: TREND_PERIOD_LABEL,
      hintTone: hintToneFromDelta(activeDelta),
      href: '/deals',
      trend: activeTrend,
    },
    {
      id: 'new-leads',
      label: 'New leads',
      value: String(newLeads),
      hint: formatCountDelta(leadDelta, 'lead'),
      hintPeriod: TREND_PERIOD_LABEL,
      hintTone: hintToneFromDelta(leadDelta),
      href: '/leads?status=New',
      trend: leadTrend,
    },
    {
      id: 'action-required',
      label: 'Action required',
      value: String(attentionItems.length),
      hint: `${urgentCount} urgent`,
      hintTone: urgentCount > 0 ? 'warning' : 'neutral',
      href: '#needs-attention',
      trend: actionTrend,
      highlighted: urgentCount > 0,
    },
    {
      id: 'pipeline-value',
      label: 'Pipeline value',
      value: formatCompactCurrency(pipelineValue),
      hint: formatCurrencyDelta(pipelineDelta),
      hintPeriod: TREND_PERIOD_LABEL,
      hintTone: hintToneFromDelta(pipelineDelta),
      href: '/deals',
      trend: valueTrend,
    },
  ]

  return {
    greetingName: CURRENT_USER.name.split(' ')[0] ?? CURRENT_USER.name,
    metrics,
    pipeline,
    pipelineDealCount,
    briefing: {
      headline: `${attentionItems.length} deals need attention today`,
      overdueApprovals,
      missingDocuments,
      criticalCount: urgentCount,
      prompt: 'Which deals need attention today?',
    },
    attentionItems,
    urgentCount,
  }
}
