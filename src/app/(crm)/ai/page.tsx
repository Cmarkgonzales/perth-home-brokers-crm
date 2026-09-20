import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function AiPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Copilot"
        description="Ask questions about deals, documents, and next steps."
      />

      <Card>
        <CardContent className="space-y-3 py-8">
          <p className="text-sm font-medium text-text-primary">
            ✦ PHB AI
          </p>
          <p className="text-sm text-text-secondary">
            The AI copilot interface will connect to deal context from the demo
            data layer.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
