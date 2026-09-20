import { getApprovalAiSummary } from '@/domain/ai/mock-copilot'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Sparkles, XCircle } from 'lucide-react'

interface AiApprovalSummaryProps {
  approvalId: string
}

export function AiApprovalSummary ({ approvalId }: AiApprovalSummaryProps) {
  const summary = getApprovalAiSummary(approvalId)

  if (!summary) return null

  return (
    <Card className="border border-phb-yellow/25 bg-[#FFFCF0] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-text-secondary">{summary.summary}</p>

        <div className="flex items-center gap-2">
          {summary.budgetFit ? (
            <>
              <CheckCircle2 className="size-4 text-success" aria-hidden />
              <span className="text-success">Within client budget</span>
            </>
          ) : (
            <>
              <XCircle className="size-4 text-danger" aria-hidden />
              <span className="text-danger">May exceed client budget</span>
            </>
          )}
        </div>

        {summary.missingDocuments.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Missing documents
            </p>
            <ul className="mt-1 space-y-0.5">
              {summary.missingDocuments.map((doc) => (
                <li key={doc} className="text-warning">⚠ {doc}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
