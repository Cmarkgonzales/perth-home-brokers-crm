import Link from 'next/link'
import type { Client } from '@/domain/clients/client.types'
import type { Commission } from '@/domain/commissions/commission.types'
import type { Deal } from '@/domain/deals/deal.types'
import type { Document } from '@/domain/documents/document.types'
import type { Activity } from '@/domain/activities/activity.types'
import type { DealPackageConfig } from '@/domain/packages/package.types'
import type { Task } from '@/domain/tasks/task.types'
import { DealWorkspaceHeader } from '@/components/deals/deal-workspace-header'
import { DealProgressCard } from '@/components/deals/deal-progress-card'
import { NextActionCard } from '@/components/deals/next-action-card'
import { DealDocumentsSummary } from '@/components/deals/deal-documents-summary'
import { DealPackageSummary } from '@/components/deals/deal-package-summary'
import { DealAiSummary } from '@/components/deals/deal-ai-summary'
import { DealTasksPanel } from '@/components/deals/deal-tasks-panel'
import { DealCommissionCard } from '@/components/deals/deal-commission-card'
import { DealTimeline } from '@/components/deals/deal-timeline'

interface DealWorkspaceProps {
  deal: Deal
  client?: Client
  documents: Document[]
  activities: Activity[]
  tasks: Task[]
  packageConfig?: DealPackageConfig
  commission?: Commission
}

export function DealWorkspace ({
  deal,
  client,
  documents,
  activities,
  tasks,
  packageConfig,
  commission,
}: DealWorkspaceProps) {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/deals" className="hover:text-text-primary">
              Deals
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">{deal.name}</li>
        </ol>
      </nav>

      <DealWorkspaceHeader
        deal={deal}
        client={client}
        documents={documents}
        packageConfig={packageConfig}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <DealProgressCard deal={deal} />
          <NextActionCard deal={deal} />
          <DealTimeline activities={activities} />
        </div>

        <aside className="space-y-5">
          <DealAiSummary
            deal={deal}
            clientName={client?.name ?? deal.name}
            documents={documents}
          />
          <DealDocumentsSummary dealId={deal.id} documents={documents} />
          <DealTasksPanel tasks={tasks} />
          <DealPackageSummary dealId={deal.id} packageConfig={packageConfig} />
          {commission ? (
            <DealCommissionCard commission={commission} />
          ) : null}
        </aside>
      </div>
    </div>
  )
}
