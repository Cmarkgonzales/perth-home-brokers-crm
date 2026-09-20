import Link from 'next/link'
import { filterLeadsByStatus, isLeadStatus } from '@/data/demo'
import { PageHeader } from '@/components/layout/page-header'
import { LeadsTable } from '@/components/leads/leads-table'
import { NewLeadDialog } from '@/components/leads/new-lead-dialog'

export default async function LeadsPage ({
  searchParams,
}: PageProps<'/leads'>) {
  const params = await searchParams
  const statusParam = params.status
  const status =
    typeof statusParam === 'string' && isLeadStatus(statusParam)
      ? statusParam
      : undefined
  const leads = filterLeadsByStatus(status)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={
          status
            ? `Showing ${status.toLowerCase()} leads.`
            : 'Track inbound enquiries and qualification status.'
        }
        actions={<NewLeadDialog />}
      />

      {status ? (
        <p className="text-sm text-text-secondary">
          <Link href="/leads" className="font-medium text-text-primary hover:underline">
            Show all leads
          </Link>
        </p>
      ) : null}

      <LeadsTable leads={leads} />
    </div>
  )
}
