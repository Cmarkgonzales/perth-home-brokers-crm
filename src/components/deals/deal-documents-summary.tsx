import type { Document } from '@/domain/documents/document.types'
import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface DealDocumentsSummaryProps {
  dealId: string
  documents: Document[]
  missingCount: number
}

function DocumentStatusIcon ({ status }: { status: Document['status'] }) {
  if (status === 'complete') {
    return <CheckCircle2 className="size-4 text-success" aria-hidden />
  }
  if (status === 'missing') {
    return <AlertCircle className="size-4 text-danger" aria-hidden />
  }
  return <Clock className="size-4 text-warning" aria-hidden />
}

export function DealDocumentsSummary ({
  dealId,
  documents,
  missingCount,
}: DealDocumentsSummaryProps) {
  const requiredDocs = documents.filter((doc) => doc.required)

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Documents</CardTitle>
        {missingCount > 0 && (
          <Badge variant="secondary" className="bg-danger/10 text-danger">
            {missingCount} missing
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {requiredDocs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <DocumentStatusIcon status={doc.status} />
                <span>{doc.name}</span>
              </span>
              <Badge
                variant="secondary"
                className={
                  doc.status === 'missing'
                    ? 'bg-danger/10 text-danger'
                    : doc.status === 'review'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-success/10 text-success'
                }
              >
                {doc.status}
              </Badge>
            </li>
          ))}
        </ul>
        <ButtonLink href={`/documents?deal=${dealId}`} variant="outline" size="sm">
          View all documents
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
