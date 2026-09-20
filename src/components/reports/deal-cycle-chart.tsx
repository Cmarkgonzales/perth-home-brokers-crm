'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DealCycleMetric } from '@/domain/reporting/pipeline-metrics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DealCycleChartProps {
  metrics: DealCycleMetric[]
  monthlySettlements: { month: string; count: number }[]
}

export function DealCycleChart ({ metrics, monthlySettlements }: DealCycleChartProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Average deal cycle (days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#626262' }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={88}
                  tick={{ fontSize: 10, fill: '#626262' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E5E5E3',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} days`, 'Average']}
                />
                <Bar dataKey="days" fill="#357ABD" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Monthly settlements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySettlements} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#626262' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#626262' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E5E5E3',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#168A5B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
