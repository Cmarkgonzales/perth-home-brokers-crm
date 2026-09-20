import Link from 'next/link'
import { isDealStage } from '@/domain/deals/deal-stage'
import {
  getPipelineGroupById,
  isDashboardPipelineGroupId,
} from '@/domain/deals/pipeline-groups'
import { demoClients, filterDeals } from '@/data/demo'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { DealList } from '@/components/deals/deal-list'
import { DealStageFilter } from '@/components/deals/deal-stage-filter'
import { NewDealDialog } from '@/components/deals/new-deal-dialog'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'

export default async function DealsPage ({
  searchParams,
}: PageProps<'/deals'>) {
  const params = await searchParams
  const stageParam = params.stage
  const stage =
    typeof stageParam === 'string' && isDealStage(stageParam)
      ? stageParam
      : undefined
  const groupParam = params.group
  const group =
    typeof groupParam === 'string' && isDashboardPipelineGroupId(groupParam)
      ? groupParam
      : undefined
  const atRisk = params.risk === '1' || params.risk === 'true'
  const deals = filterDeals({ stage, group, atRisk })
  const pipelineGroup = group ? getPipelineGroupById(group) : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        description="Monitor deal progress from lead through settlement."
        actions={<NewDealDialog clients={demoClients} />}
      />

      {(pipelineGroup || atRisk) && (
        <p className="text-sm text-text-secondary">
          {pipelineGroup && (
            <>
              Showing {pipelineGroup.label.toLowerCase()} stages
              {pipelineGroup.stages.length > 1
                ? ` (${pipelineGroup.stages
                    .map((stage) => DEAL_STAGE_LABELS[stage])
                    .join(', ')})`
                : ''}
            </>
          )}
          {pipelineGroup && atRisk ? ' · ' : null}
          {atRisk ? 'At-risk deals only' : null}
          {' '}
          <Link href="/deals" className="font-medium text-text-primary hover:underline">
            Clear filter
          </Link>
        </p>
      )}

      <DealStageFilter currentStage={stage} />

      <Card className="overflow-hidden gap-0 py-0">
        <DealList deals={deals} />
      </Card>
    </div>
  )
}
