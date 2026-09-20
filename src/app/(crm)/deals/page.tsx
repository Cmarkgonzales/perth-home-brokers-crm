import { DEAL_STAGES } from '@/domain/deals/deal-stage'
import type { DealStage } from '@/domain/deals/deal.types'
import { filterDealsByStage } from '@/data/demo'
import { DealList } from '@/components/deals/deal-list'
import { DealStageFilter } from '@/components/deals/deal-stage-filter'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'

export default async function DealsPage ({
  searchParams,
}: PageProps<'/deals'>) {
  const params = await searchParams
  const stageParam = params.stage
  const stage =
    typeof stageParam === 'string' &&
    DEAL_STAGES.includes(stageParam as DealStage)
      ? (stageParam as DealStage)
      : undefined
  const deals = filterDealsByStage(stage)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        description="Monitor deal progress from lead through settlement."
      />

      <DealStageFilter currentStage={stage} />

      <Card className="overflow-hidden gap-0 py-0">
        <DealList deals={deals} />
      </Card>
    </div>
  )
}
