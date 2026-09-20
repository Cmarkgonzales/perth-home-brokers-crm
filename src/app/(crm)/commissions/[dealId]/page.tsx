import { notFound } from 'next/navigation'
import { getCommissionByDealId } from '@/data/demo/commissions'
import { CommissionDetail } from '@/components/commissions/commission-detail'

export default async function CommissionDetailPage ({
  params,
}: {
  params: Promise<{ dealId: string }>
}) {
  const { dealId } = await params
  const commission = getCommissionByDealId(dealId)

  if (!commission) {
    notFound()
  }

  return <CommissionDetail commission={commission} />
}
