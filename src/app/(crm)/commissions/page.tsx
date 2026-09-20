import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function CommissionsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description="Commission tracking arrives in Plan 3."
      />
      <Card>
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          Pipeline commission, expected, and paid views will be available here.
        </CardContent>
      </Card>
    </div>
  )
}
