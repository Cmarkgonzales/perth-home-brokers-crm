import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApprovalsPage () {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Approvals</h2>
        <p className="text-sm text-muted-foreground">
          Finance, land, and builder approvals pending review.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming in Phase 2</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Approval workflows will be built on top of the Williams Family Home
          demo deal.
        </CardContent>
      </Card>
    </div>
  )
}
