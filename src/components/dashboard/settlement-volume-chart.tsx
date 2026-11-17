'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface SettlementVolumeChartProps {
  data: { month: string; count: number }[]
  className?: string
}

export function SettlementVolumeChart ({
  data,
  className = 'h-28',
}: SettlementVolumeChartProps) {
  return (
    <div className={className} role="img" aria-label="Monthly settlement volume">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, left: -22, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#8A8A87' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            width={28}
            tick={{ fontSize: 10, fill: '#8A8A87' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E5E5E3',
              fontSize: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            labelStyle={{ color: '#242424', fontWeight: 600 }}
            formatter={(value) => [String(value), 'Settlements']}
          />
          <Bar
            dataKey="count"
            fill="#357ABD"
            fillOpacity={0.85}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}