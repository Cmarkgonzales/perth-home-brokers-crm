import type { Deal } from '@/domain/deals/deal.types'
import type { Document } from '@/domain/documents/document.types'
import { getDealInsight } from '@/domain/ai/mock-copilot'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface DealAiSummaryProps {
  deal: Deal
  clientName: string
  documents: Document[]
}

function fallbackInsight (
  deal: Deal,
  clientName: string,
  documents: Document[]
): { insight: string; suggestedNextStep: string } {
  const required = documents.filter((doc) => doc.required)
  const verified = required.filter((doc) => doc.status === 'complete').length
  const missing = required.filter((doc) => doc.status === 'missing')
  const stageLabel = DEAL_STAGE_LABELS[deal.stage]

  const documentLine =
    required.length === 0
      ? 'No required documents have been recorded yet.'
      : `${verified} of ${required.length} documents are verified${
          missing.length > 0
            ? `; ${missing.map((doc) => doc.name.toLowerCase()).join(' and ')} ${
                missing.length === 1 ? 'is' : 'are'
              } still missing`
            : ''
        }.`

  return {
    insight: `${clientName} is ${deal.progress}% through the deal at the ${stageLabel} stage. ${documentLine}`,
    suggestedNextStep: deal.nextAction.toLowerCase(),
  }
}

export function DealAiSummary ({
  deal,
  clientName,
  documents,
}: DealAiSummaryProps) {
  const insight = getDealInsight(deal.id)
  const fallback = fallbackInsight(deal, clientName, documents)
  const body = insight?.insight ?? fallback.insight
  const suggestedNextStep =
    insight?.suggestedNextStep ?? fallback.suggestedNextStep

  return (
    <Card className="border-phb-yellow/30 bg-[#FFFCF0] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI deal summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-text-primary">{body}</p>
        <p className="text-sm text-text-primary">
          <span className="font-semibold">Suggested next step:</span>{' '}
          {suggestedNextStep}.
        </p>
        <ButtonLink href="/ai" variant="brand" className="h-9 w-full">
          Ask Copilot what to do next
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
