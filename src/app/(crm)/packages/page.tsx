import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function PackagesPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Packages"
        description="Package Builder arrives in Plan 2."
      />
      <Card>
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          Land + builder package configuration will be available here.
        </CardContent>
      </Card>
    </div>
  )
}
