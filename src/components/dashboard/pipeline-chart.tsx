'use client'

import Link from 'next/link'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PipelineStageCount } from '@/data/demo'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PipelineChartProps {
  stages: PipelineStageCount[]
}

export function PipelineChart ({ stages }: PipelineChartProps) {
  const data = stages.map(({ stage, count }) => ({
    stage,
    label: DEAL_STAGE_LABELS[stage],
    count,
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Pipeline by stage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#626262' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#626262' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E5E5E3',
                  fontSize: 12,
                }}
                formatter={(value) => [value, 'Deals']}
              />
              <Bar
                dataKey="count"
                fill="#E21F26"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.map(({ stage, count }) => (
            <Link
              key={stage}
              href={`/deals?stage=${stage}`}
              className="rounded-md bg-surface-strong px-2 py-1 text-xs text-text-secondary hover:bg-table-hover"
            >
              {DEAL_STAGE_LABELS[stage]}: {count}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
