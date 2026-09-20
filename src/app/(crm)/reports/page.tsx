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
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader
          title="Reports"
          description="Pipeline analytics and conversion metrics."
        />
        <Button variant="outline" size="sm" className="w-fit gap-2">
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
