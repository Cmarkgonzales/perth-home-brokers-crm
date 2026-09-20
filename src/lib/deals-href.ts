import type { DealStage } from '@/domain/deals/deal.types'
import type { DashboardPipelineGroupId } from '@/domain/deals/pipeline-groups'

export type DealsView = 'board' | 'list'

export function isDealsView (value: string): value is DealsView {
  return value === 'board' || value === 'list'
}

export interface DealsQuery {
  view?: DealsView
  stage?: DealStage
  group?: DashboardPipelineGroupId
  atRisk?: boolean
}

export function buildDealsHref (query: DealsQuery = {}): string {
  const params = new URLSearchParams()

  if (query.view === 'list') {
    params.set('view', 'list')
  }

  if (query.stage) {
    params.set('stage', query.stage)
  }

  if (query.group) {
    params.set('group', query.group)
  }

  if (query.atRisk) {
    params.set('risk', '1')
  }

  const search = params.toString()
  return search ? `/deals?${search}` : '/deals'
}
