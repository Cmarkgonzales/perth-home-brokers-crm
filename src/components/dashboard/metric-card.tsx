import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string
  hint?: string
  accent?: 'brand' | 'action' | 'danger' | 'neutral'
}

export function MetricCard ({
  label,
  value,
  hint,
  accent = 'neutral',
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={cn(
            'mb-3 h-0.5 w-8 rounded-full',
            accent === 'brand' && 'bg-phb-red',
            accent === 'action' && 'bg-phb-yellow',
            accent === 'danger' && 'bg-danger',
            accent === 'neutral' && 'bg-border-strong'
          )}
        />
        <p className="text-xs font-medium tracking-wide text-text-tertiary uppercase">
          {label}
        </p>
        <p className="mt-1 text-[28px] leading-none font-semibold tracking-tight break-words text-text-primary tabular-nums sm:text-[32px]">
          {value}
        </p>
        {hint && (
          <p className="mt-2 text-[13px] text-text-secondary">{hint}</p>
        )}
      </CardContent>
    </Card>
  )
}
