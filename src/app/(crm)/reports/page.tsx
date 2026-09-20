import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function ReportsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Business intelligence reporting arrives in Plan 3."
      />
      <Card>
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          Conversion funnel and pipeline analytics will be available here.
        </CardContent>
      </Card>
    </div>
  )
}
