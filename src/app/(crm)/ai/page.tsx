import { PageHeader } from '@/components/layout/page-header'
import { AiCopilotWithAgents } from '@/components/ai/ai-copilot-with-agents'

export default async function AiPage ({
  searchParams,
}: PageProps<'/ai'>) {
  const params = await searchParams
  const initialPrompt = typeof params.q === 'string' ? params.q : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        title="AI Copilot"
        description="Context-aware AI embedded in your Perth Home Brokers workflow. Ask about your deals, clients, and more."
      />
      <AiCopilotWithAgents initialPrompt={initialPrompt} />
    </div>
  )
}
