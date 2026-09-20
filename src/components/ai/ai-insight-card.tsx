import Link from 'next/link'
import { getDealInsight } from '@/domain/ai/mock-copilot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface AiInsightCardProps {
  dealId: string
  dealName: string
}

export function AiInsightCard ({ dealId, dealName }: AiInsightCardProps) {
  const insight = getDealInsight(dealId)

  if (!insight) return null

  return (
    <Card className="border border-phb-yellow/30 bg-[#FFFCF0] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-text-primary">{insight.insight}</p>
        {insight.nextActions.length > 0 && (
          <ul className="space-y-1 text-sm text-text-secondary">
            {insight.nextActions.map((action) => (
              <li key={action}>→ {action}</li>
            ))}
          </ul>
        )}
        <Link
          href="/ai"
          className="inline-flex text-xs font-medium text-text-primary hover:underline"
        >
          Ask AI about {dealName} →
        </Link>
      </CardContent>
    </Card>
  )
}
