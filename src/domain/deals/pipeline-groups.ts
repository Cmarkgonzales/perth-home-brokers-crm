import type { DealStage } from '@/domain/deals/deal.types'

export const DASHBOARD_PIPELINE_GROUPS = [
  { id: 'new', label: 'New', stages: ['lead'] },
  { id: 'qualified', label: 'Qualified', stages: ['qualified'] },
  { id: 'finance', label: 'Finance', stages: ['finance'] },
  {
    id: 'package',
    label: 'Package',
    stages: ['land', 'builder', 'package'],
  },
  {
    id: 'build',
    label: 'Build',
    stages: ['drafting', 'approval', 'construction'],
  },
  { id: 'settlement', label: 'Settlement', stages: ['settlement'] },
] as const

export type DashboardPipelineGroupId =
  (typeof DASHBOARD_PIPELINE_GROUPS)[number]['id']

export type DashboardPipelineGroup =
  (typeof DASHBOARD_PIPELINE_GROUPS)[number]

export function isDashboardPipelineGroupId (
  value: string
): value is DashboardPipelineGroupId {
  return DASHBOARD_PIPELINE_GROUPS.some((group) => group.id === value)
}

export function getPipelineGroupById (
  id: DashboardPipelineGroupId
): DashboardPipelineGroup {
  const group = DASHBOARD_PIPELINE_GROUPS.find((item) => item.id === id)
  if (!group) {
    throw new Error(`Unknown pipeline group: ${id}`)
  }
  return group
}

export function getPipelineGroupForStage (
  stage: DealStage
): DashboardPipelineGroup {
  const group = DASHBOARD_PIPELINE_GROUPS.find((item) =>
    (item.stages as readonly DealStage[]).includes(stage)
  )
  if (!group) {
    throw new Error(`No dashboard pipeline group for stage: ${stage}`)
  }
  return group
}

export function groupDealsByPipelineGroup<T extends { stage: DealStage }> (
  deals: T[]
): Array<DashboardPipelineGroup & { deals: T[] }> {
  return DASHBOARD_PIPELINE_GROUPS.map((group) => ({
    ...group,
    deals: deals.filter((deal) =>
      (group.stages as readonly DealStage[]).includes(deal.stage)
    ),
  }))
}
