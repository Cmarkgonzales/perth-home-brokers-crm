import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function ApprovalsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Finance, land, and builder approvals pending review."
      />

      <Card>
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          Approval workflows will be built on top of the Williams Family Home
          demo deal.
        </CardContent>
      </Card>
    </div>
  )
}
