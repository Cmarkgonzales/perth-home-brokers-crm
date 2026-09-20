import Link from 'next/link'
import { demoAgentRuns } from '@/data/demo/agent-runs'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/formatting'

export default function AiActivityPage () {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/ai"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to AI Copilot
        </Link>
        <PageHeader
          title="Agent activity"
          description="Audit trail of AI agent runs and human approval decisions."
        />
      </div>

      <div className="space-y-3">
        {demoAgentRuns.map((record) => (
          <Card key={record.id} className="border-border shadow-none">
            <CardContent className="space-y-3 py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-text-primary">{record.trigger}</p>
                  <p className="text-xs text-text-tertiary">
                    {formatDate(record.timestamp)}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    record.humanApproved
                      ? 'bg-success/10 text-success'
                      : 'bg-surface-strong text-text-secondary'
                  }
                >
                  {record.humanApproved ? 'Human approved' : 'Auto completed'}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary">{record.outcome}</p>
              <div className="flex flex-wrap gap-1.5">
                {record.toolsUsed.map((tool) => (
                  <code
                    key={tool}
                    className="rounded bg-surface-strong px-2 py-0.5 text-xs text-text-tertiary"
                  >
                    {tool}
                  </code>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
