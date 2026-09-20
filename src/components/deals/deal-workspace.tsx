import Link from 'next/link'
import type { Client } from '@/domain/clients/client.types'
import type { Deal } from '@/domain/deals/deal.types'
import type { Document } from '@/domain/documents/document.types'
import type { Activity } from '@/domain/activities/activity.types'
import type { DealPackageConfig } from '@/domain/packages/package.types'
import type { Task } from '@/domain/tasks/task.types'
import { formatCurrency } from '@/lib/formatting'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { DealStageStepper } from '@/components/deals/deal-stage-stepper'
import { NextActionCard } from '@/components/deals/next-action-card'
import { DealDocumentsSummary } from '@/components/deals/deal-documents-summary'
import { DealPackageSummary } from '@/components/deals/deal-package-summary'
import { AiInsightPlaceholder } from '@/components/deals/ai-insight-placeholder'
import { DealTimeline } from '@/components/deals/deal-timeline'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle } from 'lucide-react'

interface DealWorkspaceProps {
  deal: Deal
  client?: Client
  documents: Document[]
  activities: Activity[]
  tasks: Task[]
  packageConfig?: DealPackageConfig
  missingCount: number
}

export function DealWorkspace ({
  deal,
  client,
  documents,
  activities,
  tasks,
  packageConfig,
  missingCount,
}: DealWorkspaceProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/deals"
            className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to deals
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-[32px] font-semibold tracking-tight text-text-primary">
              {deal.name}
            </h1>
            {deal.atRisk && (
              <AlertTriangle className="size-5 text-danger" aria-label="At risk" />
            )}
          </div>
          <p className="font-mono text-sm text-text-tertiary">{deal.id}</p>
          {client && (
            <Link
              href={`/clients/${client.id}`}
              className="mt-1 inline-block text-sm font-medium text-text-primary hover:underline"
            >
              {client.name}
            </Link>
          )}
        </div>
        <div className="text-right">
          <p className="text-[32px] font-semibold tracking-tight text-text-primary">
            {formatCurrency(deal.value)}
          </p>
          <DealStageBadge stage={deal.stage} className="mt-2" />
        </div>
      </div>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DealStageStepper currentStage={deal.stage} />
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deal progress</span>
              <span>{deal.progress}%</span>
            </div>
            <Progress value={deal.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <NextActionCard deal={deal} />
        <AiInsightPlaceholder dealName={deal.name} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DealDocumentsSummary
          dealId={deal.id}
          documents={documents}
          missingCount={missingCount}
        />
        <DealPackageSummary dealId={deal.id} packageConfig={packageConfig} />
      </div>

      {tasks.length > 0 && (
        <Card className="border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Open tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-text-secondary">
                      {task.assignee} · Due {task.dueDate}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      task.priority === 'high'
                        ? 'bg-danger/10 text-danger'
                        : task.priority === 'medium'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-muted text-muted-foreground'
                    }
                  >
                    {task.priority}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <DealTimeline activities={activities} />

      <div className="text-center">
        <Link
          href={`/deals/${deal.id}/timeline`}
          className="text-sm text-text-secondary hover:text-text-primary hover:underline"
        >
          View full timeline page →
        </Link>
      </div>
    </div>
  )
}
