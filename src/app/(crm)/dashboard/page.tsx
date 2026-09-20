import {
  getActiveDealsCount,
  getAttentionItems,
  getAtRiskDealsCount,
  getNewLeadsCount,
  getPipelineCounts,
  getPipelineValue,
} from '@/data/demo'
import { CURRENT_USER } from '@/lib/constants'
import { formatCurrency, getGreeting } from '@/lib/formatting'
import { MetricCard } from '@/components/dashboard/metric-card'
import { NeedsAttentionList } from '@/components/dashboard/needs-attention-list'
import { PipelineBar } from '@/components/dashboard/pipeline-bar'

export default function DashboardPage () {
  const pipelineStages = getPipelineCounts()
  const attentionItems = getAttentionItems()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {getGreeting()}, {CURRENT_USER.name.split(' ')[0]}. Here&apos;s
          what&apos;s happening across PHB today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active deals"
          value={String(getActiveDealsCount())}
          hint="Excluding settled deals"
          accent="brand"
        />
        <MetricCard
          label="New leads"
          value={String(getNewLeadsCount())}
          hint="Awaiting first contact"
          accent="action"
        />
        <MetricCard
          label="At risk"
          value={String(getAtRiskDealsCount())}
          hint="Needs immediate attention"
          accent="danger"
        />
        <MetricCard
          label="Pipeline value"
          value={formatCurrency(getPipelineValue())}
          hint="Active deal total"
          accent="neutral"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <PipelineBar stages={pipelineStages} />
        <NeedsAttentionList items={attentionItems} />
      </div>
    </div>
  )
}
