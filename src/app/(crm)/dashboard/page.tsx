import { demoClients, getDashboardSnapshot } from '@/data/demo'
import { getGreeting } from '@/lib/formatting'
import { pageTitleClass } from '@/components/layout/page-header'
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card'
import { NeedsAttentionList } from '@/components/dashboard/needs-attention-list'
import { PipelineChart } from '@/components/dashboard/pipeline-chart'
import { AiBusinessBrief } from '@/components/dashboard/ai-business-brief'
import { NewDealDialog } from '@/components/deals/new-deal-dialog'

export const dynamic = 'force-dynamic'

export default function DashboardPage () {
  const snapshot = getDashboardSnapshot()

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className={pageTitleClass} suppressHydrationWarning>
            {getGreeting()}, {snapshot.greetingName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Here&apos;s what needs your attention today.
          </p>
        </div>
        <NewDealDialog clients={demoClients} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <DashboardMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,1fr)] lg:gap-6">
        <PipelineChart
          stages={snapshot.pipeline}
          dealCount={snapshot.pipelineDealCount}
        />
        <AiBusinessBrief briefing={snapshot.briefing} />
      </div>

      <NeedsAttentionList items={snapshot.attentionItems} />
    </div>
  )
}
