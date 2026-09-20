import { notFound } from 'next/navigation'
import {
  getClientById,
  getCommissionByDealId,
  getDealById,
  getDocumentsByDealId,
  getActivitiesByDealId,
  getTasksByDealId,
  getPackageConfigForDeal,
} from '@/data/demo'
import { DealWorkspace } from '@/components/deals/deal-workspace'

export default async function DealDetailPage ({
  params,
}: PageProps<'/deals/[id]'>) {
  const { id } = await params
  const deal = getDealById(id)

  if (!deal) {
    notFound()
  }

  const client = getClientById(deal.clientId)
  const documents = getDocumentsByDealId(deal.id)
  const activities = getActivitiesByDealId(deal.id)
  const tasks = getTasksByDealId(deal.id)
  const packageConfig = getPackageConfigForDeal(deal.id)
  const commission = getCommissionByDealId(deal.id)

  return (
    <DealWorkspace
      deal={deal}
      client={client}
      documents={documents}
      activities={activities}
      tasks={tasks}
      packageConfig={packageConfig}
      commission={commission}
    />
  )
}
