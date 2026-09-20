import { demoCommissions, getCommissionSummary } from '@/data/demo/commissions'
import { PageHeader } from '@/components/layout/page-header'
import { CommissionSummaryCards } from '@/components/commissions/commission-summary-cards'
import { CommissionTable } from '@/components/commissions/commission-table'

export default function CommissionsPage () {
  const summary = getCommissionSummary()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description={`Commission tracking for ${summary.period}.`}
      />
      <CommissionSummaryCards summary={summary} />
      <CommissionTable commissions={demoCommissions} />
    </div>
  )
}
