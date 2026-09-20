import { checkDocument } from '@/domain/ai/mock-copilot'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Sparkles } from 'lucide-react'

interface AiDocumentCheckProps {
  documentId: string
}

export function AiDocumentCheck ({ documentId }: AiDocumentCheckProps) {
  const result = checkDocument(documentId)

  if (!result || result.status === 'ok') return null

  return (
    <Card className="border border-warning/30 bg-[#FFFCF0] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI document check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <div>
            <p className="font-medium text-text-primary">
              {result.status === 'mismatch' ? 'Document missing' : 'Potential mismatch'}
            </p>
            <p className="text-text-secondary">{result.documentName}</p>
          </div>
        </div>

        {result.extractedFields.length > 0 && (
          <dl className="space-y-1 rounded-lg bg-white p-3">
            {result.extractedFields.map((field) => (
              <div key={field.label} className="flex justify-between gap-4">
                <dt className="text-text-tertiary">{field.label}</dt>
                <dd className="font-medium text-text-primary">{field.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {result.issue && (
          <p className="text-text-secondary">{result.issue}</p>
        )}

        <Button variant="outline" size="sm" className="border-phb-yellow/40">
          Review
        </Button>
      </CardContent>
    </Card>
  )
}
