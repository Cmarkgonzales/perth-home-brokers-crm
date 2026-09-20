import { notFound } from 'next/navigation'
import { getDealById, getPackageConfigForDeal } from '@/data/demo'
import { PackageBuilder } from '@/components/packages/package-builder'

export default async function PackageBuilderPage ({
  searchParams,
}: PageProps<'/packages/builder'>) {
  const { dealId } = await searchParams
  const resolvedDealId =
    typeof dealId === 'string' ? dealId : 'PHB-2026-00142'

  const deal = getDealById(resolvedDealId)

  if (!deal) {
    notFound()
  }

  const initialConfig = getPackageConfigForDeal(deal.id)

  return (
    <PackageBuilder deal={deal} initialConfig={initialConfig} />
  )
}
