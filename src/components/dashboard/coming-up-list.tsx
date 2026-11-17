import Link from 'next/link'
import type { ComingUpItem } from '@/domain/dashboard/dashboard.types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ComingUpListProps {
  items: ComingUpItem[]
}

function HouseFacadeIllustration () {
  return (
    <svg
      viewBox="0 0 120 72"
      className="h-14 w-auto text-text-primary/90"
      aria-hidden
    >
      <polygon
        points="60,8 104,36 16,36"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="28"
        y="36"
        width="64"
        height="32"
        rx="2"
        fill="currentColor"
        opacity="0.08"
      />
      <rect
        x="52"
        y="48"
        width="16"
        height="20"
        rx="1"
        className="fill-phb-red"
        opacity="0.85"
      />
    </svg>
  )
}

export function ComingUpList ({ items }: ComingUpListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-base font-semibold text-text-primary">
          Coming up
        </CardTitle>
        <Link
          href="/deals?stage=settlement"
          className="text-xs font-medium text-text-secondary hover:text-text-primary"
        >
          Settlements →
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-secondary">
            No upcoming settlements or packages to show.
          </p>
        ) : (
          items.map((item) => (
            <Link
              key={item.dealId}
              href={item.href}
              className="flex overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:bg-table-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="flex w-24 shrink-0 items-center justify-center bg-gradient-to-b from-surface-strong to-surface-muted">
                <HouseFacadeIllustration />
              </div>
              <div className="min-w-0 flex-1 p-3">
                <p className="text-sm font-semibold text-text-primary">
                  {item.title}
                </p>
                {item.packageLine ? (
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {item.packageLine}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                  <span className="font-medium tabular-nums text-text-primary">
                    {item.valueLabel}
                  </span>
                  <span className="text-text-secondary">{item.dueLabel}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}