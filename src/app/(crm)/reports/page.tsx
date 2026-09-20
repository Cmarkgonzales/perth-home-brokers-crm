'use client'

import { getReportingSnapshot } from '@/domain/reporting/pipeline-metrics'
import { PageHeader } from '@/components/layout/page-header'
import { ConversionFunnel } from '@/components/reports/conversion-funnel'
import { DealCycleChart } from '@/components/reports/deal-cycle-chart'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function ReportsPage () {
  const snapshot = getReportingSnapshot()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Reports"
          description="Pipeline analytics and conversion metrics from demo data."
        />
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" aria-hidden />
          Export report
        </Button>
      </div>

      <ConversionFunnel
        stages={snapshot.funnel}
        conversionRate={snapshot.conversionRate}
      />

      <DealCycleChart
        metrics={snapshot.dealCycleMetrics}
        monthlySettlements={snapshot.monthlySettlements}
      />
    </div>
  )
}
