import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function SettingsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Application settings placeholder."
      />
      <Card>
        <CardContent className="py-8 text-center text-sm text-text-secondary">
          User preferences and team configuration will be available in a future
          phase.
        </CardContent>
      </Card>
    </div>
  )
}
