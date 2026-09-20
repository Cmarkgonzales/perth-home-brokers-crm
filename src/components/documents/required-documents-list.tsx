'use client'

import type { Document } from '@/domain/documents/document.types'
import {
  DOCUMENT_STATUS_CLASS,
  DOCUMENT_STATUS_LABEL,
} from '@/domain/documents/document.constants'
import {
  getDocumentSourceLine,
  getRequiredDocumentProgress,
} from '@/domain/documents/document-utils'
import { DocumentProgressBar } from '@/components/documents/document-progress-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RequiredDocumentsListProps {
  documents: Document[]
  headerAction?: React.ReactNode
  showProgress?: boolean
  onOpenDocument: (doc: Document) => void
}

function DocumentStatusIcon ({ status }: { status: Document['status'] }) {
  if (status === 'complete') {
    return <CheckCircle2 className="size-5 text-success" aria-hidden />
  }
  if (status === 'missing') {
    return <AlertCircle className="size-5 text-danger" aria-hidden />
  }
  return <Clock className="size-5 text-warning" aria-hidden />
}

export function RequiredDocumentsList ({
  documents,
  headerAction,
  showProgress = true,
  onOpenDocument,
}: RequiredDocumentsListProps) {
  const { required, requiredCount, verifiedCount } =
    getRequiredDocumentProgress(documents)

  return (
    <Card className="gap-0 border-border py-0 shadow-none">
      <CardHeader className="gap-3 border-b border-border py-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold">
            Required documents
          </CardTitle>
          {headerAction ?? (
            showProgress ? (
              <p className="text-sm text-text-secondary">
                {verifiedCount} of {requiredCount} verified
              </p>
            ) : null
          )}
        </div>
        {showProgress && requiredCount > 0 ? (
          <DocumentProgressBar
            verifiedCount={verifiedCount}
            requiredCount={requiredCount}
          />
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        {required.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No required documents recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {required.map((doc) => {
              const subtitle = getDocumentSourceLine(doc)

              return (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <DocumentStatusIcon status={doc.status} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {doc.name}
                      </p>
                      {subtitle ? (
                        <p className="mt-0.5 truncate text-sm text-text-tertiary">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Badge
                      variant="secondary"
                      className={cn(DOCUMENT_STATUS_CLASS[doc.status])}
                    >
                      {DOCUMENT_STATUS_LABEL[doc.status]}
                    </Badge>
                    {doc.status === 'review' ? (
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => onOpenDocument(doc)}
                      >
                        Review
                      </Button>
                    ) : null}
                    {doc.status === 'missing' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenDocument(doc)}
                        >
                          Request
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenDocument(doc)}
                        >
                          <Upload aria-hidden />
                          Upload
                        </Button>
                      </>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
