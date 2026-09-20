import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { AiCopilotWithAgents } from '@/components/ai/ai-copilot-with-agents'

export default function AiPage () {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="AI Copilot"
          description="Context-aware AI embedded in your PHB workflow."
        />
        <div className="flex gap-2">
          <Link
            href="/ai/architecture"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-2.5 text-sm font-medium hover:bg-surface-muted"
          >
            Architecture
          </Link>
          <Link
            href="/ai/activity"
            className="inline-flex h-8 items-center rounded-lg border border-border bg-surface px-2.5 text-sm font-medium hover:bg-surface-muted"
          >
            Activity
          </Link>
        </div>
      </div>
      <AiCopilotWithAgents />
    </div>
  )
}
