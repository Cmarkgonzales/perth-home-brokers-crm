import { demoCommissions } from '@/data/demo/commissions'
import { PageHeader } from '@/components/layout/page-header'
import { CommissionsWorkspace } from '@/components/commissions/commissions-workspace'

export default async function CommissionsPage ({
  searchParams,
}: PageProps<'/commissions'>) {
  const { deal } = await searchParams
  const initialDealId = typeof deal === 'string' ? deal : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description="Commission tracking for September 2026."
      />
      <CommissionsWorkspace
        commissions={demoCommissions}
        initialDealId={initialDealId}
      />
    </div>
  )
}
