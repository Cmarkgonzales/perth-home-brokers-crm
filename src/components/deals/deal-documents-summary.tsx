import type { Document } from '@/domain/documents/document.types'
import {
  DOCUMENT_STATUS_CLASS,
  DOCUMENT_STATUS_LABEL,
} from '@/domain/documents/document.constants'
import { getRequiredDocumentProgress } from '@/domain/documents/document-utils'
import { DocumentProgressBar } from '@/components/documents/document-progress-bar'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DealDocumentsSummaryProps {
  dealId: string
  documents: Document[]
}

export function DealDocumentsSummary ({
  dealId,
  documents,
}: DealDocumentsSummaryProps) {
  const { required, requiredCount, verifiedCount } =
    getRequiredDocumentProgress(documents)

  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Documents</CardTitle>
        <CardAction>
          <ButtonLink
            href={`/documents/${dealId}`}
            variant="ghost"
            size="sm"
            className="text-text-secondary"
          >
            Open
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {requiredCount === 0 ? (
          <p className="text-sm text-text-secondary">
            No documents recorded yet.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <DocumentProgressBar
                verifiedCount={verifiedCount}
                requiredCount={requiredCount}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
              />
              <p className="text-xs tabular-nums text-text-tertiary">
                {verifiedCount} of {requiredCount}
              </p>
            </div>
            <ul className="space-y-2.5">
              {required.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={cn(
                      'inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-medium',
                      DOCUMENT_STATUS_CLASS[doc.status]
                    )}
                  >
                    {DOCUMENT_STATUS_LABEL[doc.status]}
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
