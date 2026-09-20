import type { Document, DocumentStatus } from '@/domain/documents/document.types'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DealDocumentsSummaryProps {
  dealId: string
  documents: Document[]
}

const STATUS_LABEL: Record<DocumentStatus, string> = {
  complete: 'Verified',
  review: 'Needs review',
  missing: 'Missing',
}

const STATUS_CLASS: Record<DocumentStatus, string> = {
  complete: 'bg-success/10 text-success',
  review: 'bg-warning/10 text-warning',
  missing: 'bg-danger/10 text-danger',
}

export function DealDocumentsSummary ({
  dealId,
  documents,
}: DealDocumentsSummaryProps) {
  const requiredDocs = documents.filter((doc) => doc.required)
  const verifiedCount = requiredDocs.filter(
    (doc) => doc.status === 'complete'
  ).length
  const progress =
    requiredDocs.length === 0
      ? 0
      : Math.round((verifiedCount / requiredDocs.length) * 100)

  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Documents</CardTitle>
        <CardAction>
          <ButtonLink
            href={`/documents?deal=${dealId}`}
            variant="ghost"
            size="sm"
            className="text-text-secondary"
          >
            Open
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {requiredDocs.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No documents recorded yet.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div
                role="progressbar"
                aria-valuenow={verifiedCount}
                aria-valuemin={0}
                aria-valuemax={requiredDocs.length}
                aria-label="Documents verified"
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
              >
                <div
                  className="h-full rounded-full bg-phb-yellow"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs tabular-nums text-text-tertiary">
                {verifiedCount} of {requiredDocs.length}
              </p>
            </div>
            <ul className="space-y-2.5">
              {requiredDocs.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={cn(
                      'inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-medium',
                      STATUS_CLASS[doc.status]
                    )}
                  >
                    {STATUS_LABEL[doc.status]}
                  </span>
                  <span className="min-w-0 truncate text-text-primary">
                    {doc.name}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
