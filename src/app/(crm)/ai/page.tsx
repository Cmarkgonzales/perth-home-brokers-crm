import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AiPage () {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">AI Copilot</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about deals, documents, and next steps.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming in Phase 2</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The AI copilot interface will connect to deal context from the demo
          data layer.
        </CardContent>
      </Card>
    </div>
  )
}
