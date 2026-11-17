import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { DashboardBriefing } from '@/domain/dashboard/dashboard.types'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AiBusinessBriefCompactProps {
  briefing: DashboardBriefing
  className?: string
}

export function AiBusinessBriefCompact ({
  briefing,
  className,
}: AiBusinessBriefCompactProps) {
  const promptHref = `/ai?q=${encodeURIComponent(briefing.prompt)}`

  return (
    <Card
      className={cn(
        'border-phb-yellow/25 bg-ai-briefing text-ai-briefing-foreground',
        className
      )}
      aria-labelledby="ai-briefing-compact-heading"
    >
      <CardContent className="flex flex-col space-y-4 pt-5">
        <div className="flex items-center gap-2 text-sm font-medium text-ai-briefing-muted">
          <Sparkles className="size-4 text-phb-yellow" aria-hidden />
          <h2 id="ai-briefing-compact-heading">AI briefing</h2>
        </div>

        <p className="text-base font-semibold tracking-tight">
          {briefing.headline}
        </p>

        <ul className="space-y-1.5 text-sm">
          <li>
            <Link href="/approvals" className="rounded-sm hover:underline">
              <span className="font-semibold text-phb-yellow">
                {briefing.overdueApprovals}
              </span>{' '}
              <span className="text-ai-briefing-muted">approvals overdue</span>
            </Link>
          </li>
          <li>
            <Link href="/documents" className="rounded-sm hover:underline">
              <span className="font-semibold text-phb-yellow">
                {briefing.missingDocuments}
              </span>{' '}
              <span className="text-ai-briefing-muted">documents missing</span>
            </Link>
          </li>
          <li>
            <Link href="/deals?risk=1" className="rounded-sm hover:underline">
              <span className="font-semibold text-danger-on-dark">
                {briefing.criticalCount}
              </span>{' '}
              <span className="text-ai-briefing-muted">critical</span>
            </Link>
          </li>
        </ul>

        <ButtonLink
          href={promptHref}
          variant="brand"
          className="h-9 w-full px-3"
        >
          Ask AI what to focus on
        </ButtonLink>
      </CardContent>
    </Card>
  )
}