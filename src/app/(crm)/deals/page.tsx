import { FilterX } from 'lucide-react'
import { isDealStage } from '@/domain/deals/deal-stage'
import {
  getPipelineGroupById,
  isDashboardPipelineGroupId,
} from '@/domain/deals/pipeline-groups'
import { demoClients, filterDeals, getDealBoardColumns } from '@/data/demo'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { buildDealsHref, isDealsView, type DealsQuery } from '@/lib/deals-href'
import { DealBoard } from '@/components/deals/deal-board'
import { DealList } from '@/components/deals/deal-list'
import { DealStageFilter } from '@/components/deals/deal-stage-filter'
import { DealsViewToggle } from '@/components/deals/deals-view-toggle'
import { NewDealDialog } from '@/components/deals/new-deal-dialog'
import { PageHeader } from '@/components/layout/page-header'
import { ButtonLink } from '@/components/ui/button'
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
  const viewParam = params.view
  const view =
    typeof viewParam === 'string' && isDealsView(viewParam)
      ? viewParam
      : 'board'
  const deals = filterDeals({ stage, group, atRisk })
  const pipelineGroup = group ? getPipelineGroupById(group) : undefined
  const query: DealsQuery = { view, stage, group, atRisk }
  const isFiltered = Boolean(pipelineGroup || atRisk || stage)
  const boardColumns = getDealBoardColumns(deals)
  const visibleColumns = isFiltered
    ? boardColumns.filter((column) => column.deals.length > 0)
    : boardColumns

  return (
    <div
      className={
        view === 'board'
          ? 'flex h-full min-h-0 flex-1 flex-col gap-6'
          : 'space-y-6'
      }
    >
      <PageHeader
        title="Deals"
        description="Every deal, by stage. The deal is the centre of the record."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <DealsViewToggle query={query} />
            <NewDealDialog clients={demoClients} />
          </div>
        }
      />

      {isFiltered ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-text-secondary">
            {pipelineGroup ? (
              <>
                Showing {pipelineGroup.label.toLowerCase()} stages
                {pipelineGroup.stages.length > 1
                  ? ` (${pipelineGroup.stages
                      .map((item) => DEAL_STAGE_LABELS[item])
                      .join(', ')})`
                  : ''}
              </>
            ) : null}
            {stage && !pipelineGroup ? (
              <>Showing {DEAL_STAGE_LABELS[stage].toLowerCase()} deals</>
            ) : null}
            {(pipelineGroup || stage) && atRisk ? ' · ' : null}
            {atRisk ? 'At-risk deals only' : null}
          </p>
          <ButtonLink
            href={buildDealsHref({ view })}
            variant="outline"
            size="sm"
          >
            <FilterX aria-hidden />
            Clear filter
          </ButtonLink>
        </div>
      ) : null}

      {view === 'list' ? (
        <>
          <DealStageFilter query={query} />
          <Card className="overflow-hidden gap-0 py-0">
            <DealList deals={deals} />
          </Card>
        </>
      ) : (
        <DealBoard columns={visibleColumns} />
      )}
    </div>
  )
}
