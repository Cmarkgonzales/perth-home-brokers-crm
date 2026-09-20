import { demoClients } from '@/data/demo'
import { ClientsTable } from '@/components/clients/clients-table'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'

export default function ClientsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage client profiles and active deal progress."
      />

      <Card className="overflow-hidden gap-0 py-0">
        <ClientsTable clients={demoClients} />
      </Card>
    </div>
  )
}
