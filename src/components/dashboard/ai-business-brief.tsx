import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { DashboardBriefing } from '@/domain/dashboard/dashboard.types'
import { ButtonLink } from '@/components/ui/button'

interface AiBusinessBriefProps {
  briefing: DashboardBriefing
}

export function AiBusinessBrief ({ briefing }: AiBusinessBriefProps) {
  const promptHref = `/ai?q=${encodeURIComponent(briefing.prompt)}`

  return (
    <section
      aria-labelledby="ai-briefing-heading"
      className="flex h-full flex-col rounded-[12px] bg-ai-briefing p-5 text-ai-briefing-foreground sm:p-6"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-ai-briefing-muted">
        <Sparkles className="size-4 text-phb-yellow" aria-hidden />
        <h2 id="ai-briefing-heading">AI briefing</h2>
      </div>

      <p className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
        {briefing.headline}
      </p>

      <ul className="mt-5 space-y-2 text-sm">
        <li>
          <Link
            href="/approvals"
            className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-phb-yellow/50"
          >
            <span className="font-semibold text-phb-yellow">
              {briefing.overdueApprovals}
            </span>{' '}
            <span className="text-ai-briefing-muted">
              {briefing.overdueApprovals === 1
                ? 'approval overdue'
                : 'approvals overdue'}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/documents"
            className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-phb-yellow/50"
          >
            <span className="font-semibold text-phb-yellow">
              {briefing.missingDocuments}
            </span>{' '}
            <span className="text-ai-briefing-muted">
              {briefing.missingDocuments === 1
                ? 'document missing'
                : 'documents missing'}
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="#needs-attention"
            className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-phb-yellow/50"
          >
            <span className="font-semibold text-danger-on-dark">
              {briefing.criticalCount}
            </span>{' '}
            <span className="text-ai-briefing-muted">critical</span>
          </Link>
        </li>
      </ul>

      <div className="mt-auto pt-6">
        <ButtonLink
          href={promptHref}
          variant="brand"
          className="h-9 px-3"
        >
          Ask AI what to focus on
        </ButtonLink>
      </div>
    </section>
  )
}
