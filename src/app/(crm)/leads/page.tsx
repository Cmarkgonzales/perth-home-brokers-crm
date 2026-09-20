import { demoLeads } from '@/data/demo'
import { PageHeader } from '@/components/layout/page-header'
import { LeadsTable } from '@/components/leads/leads-table'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'

export default function LeadsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Track inbound enquiries and qualification status."
        actions={<NewLeadDialog />}
      />

      <LeadsTable leads={demoLeads} />
    </div>
  )
}
