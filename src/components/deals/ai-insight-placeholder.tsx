import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface AiInsightPlaceholderProps {
  dealName: string
  insight?: string
}

export function AiInsightPlaceholder ({
  dealName,
  insight = 'Client is ready for finance review. Bank statement is missing — request before lender submission.',
}: AiInsightPlaceholderProps) {
  return (
    <Card className="border border-phb-yellow/30 bg-[#FFFCF0] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-text-primary">{insight}</p>
        <p className="text-xs text-text-tertiary">
          Context: {dealName} · Mock insight for Plan 4 integration
        </p>
      </CardContent>
    </Card>
  )
}
