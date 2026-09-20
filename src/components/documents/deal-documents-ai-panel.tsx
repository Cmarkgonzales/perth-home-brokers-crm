'use client'

import type { Document } from '@/domain/documents/document.types'
import { checkDocument } from '@/domain/ai/mock-copilot'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface DealDocumentsAiPanelProps {
  documents: Document[]
  onReview: (doc: Document) => void
}

function findFlaggedDocument (documents: Document[]): Document | undefined {
  const inReview = documents.find((doc) => doc.status === 'review')
  if (inReview) return inReview

  return documents.find((doc) => {
    const result = checkDocument(doc.id)
    return result !== null && result.status !== 'ok'
  })
}

export function DealDocumentsAiPanel ({
  documents,
  onReview,
}: DealDocumentsAiPanelProps) {
  const document = findFlaggedDocument(documents)
  const result = document ? checkDocument(document.id) : null

  if (!document || !result || result.status === 'ok') {
    return (
      <Card className="border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
            AI document check
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary">
          No mismatches flagged for this deal.
        </CardContent>
      </Card>
    )
  }

  const fields = [
    document.fileName
      ? { label: 'Uploaded document', value: document.fileName }
      : null,
    { label: 'AI detected', value: document.party ?? result.documentName },
    result.extractedFields.find((field) => field.label === 'Employer'),
    { label: 'Status', value: 'Needs manual review' },
  ].filter((field): field is { label: string; value: string } => Boolean(field))

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI document check
        </CardTitle>
        <Badge variant="secondary" className="bg-warning/10 text-warning">
          {result.status === 'mismatch' ? 'Document missing' : 'Potential mismatch'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <dl className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-start justify-between gap-4"
            >
              <dt className="shrink-0 text-text-tertiary">{field.label}</dt>
              <dd className="min-w-0 text-right font-medium break-words text-text-primary">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
        <Button variant="brand" size="sm" onClick={() => onReview(document)}>
          Review
        </Button>
      </CardContent>
    </Card>
  )
}
