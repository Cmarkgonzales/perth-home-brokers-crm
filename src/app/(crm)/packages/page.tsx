import { demoDeals } from '@/data/demo'
import type { DealStage } from '@/domain/deals/deal.types'
import { PackagesWorkspace } from '@/components/packages/packages-workspace'

const PACKAGE_STAGES: DealStage[] = ['land', 'builder', 'package', 'drafting']

export default function PackagesPage () {
  const activeDeals = demoDeals.filter((deal) =>
    PACKAGE_STAGES.includes(deal.stage)
  )

  return <PackagesWorkspace activeDeals={activeDeals} />
}
