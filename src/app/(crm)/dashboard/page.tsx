import { demoDeal } from '@/data/demo'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage () {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your pipeline and active deals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active deal spotlight</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-medium">{demoDeal.name}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{demoDeal.id}</span>
            <Badge variant="secondary">
              {DEAL_STAGE_LABELS[demoDeal.stage]}
            </Badge>
            <span>{demoDeal.progress}% complete</span>
          </div>
          <p className="text-sm">
            Next: {demoDeal.nextAction} — {demoDeal.nextActionDue}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
