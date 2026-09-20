'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Document } from '@/domain/documents/document.types'
import { cn } from '@/lib/utils'
import { DocumentDetailSheet } from '@/components/documents/document-detail-sheet'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface ClientDocumentsPanelProps {
  documents: Document[]
  dealId?: string
  dealName: string
}

function statusLabel (status: Document['status']) {
  if (status === 'complete') return 'Verified'
  if (status === 'review') return 'Needs review'
  return 'Missing'
}

function statusClass (status: Document['status']) {
  if (status === 'complete') return 'bg-success/10 text-success'
  if (status === 'review') return 'bg-warning/10 text-warning'
  return 'bg-danger/10 text-danger'
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

function documentSubtitle (doc: Document): string | null {
  const parts = [
    doc.party,
    doc.fileName,
    doc.source ? `via ${doc.source}` : null,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(', ') : null
}

export function ClientDocumentsPanel ({
  documents,
  dealId,
  dealName,
}: ClientDocumentsPanelProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  function openDocument (doc: Document) {
    setSelectedDoc(doc)
    setSheetOpen(true)
  }

  if (documents.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No documents for this client&apos;s active deal.
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="gap-0 border-border py-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border py-4">
          <CardTitle className="text-base">Required documents</CardTitle>
          {dealId ? (
            <ButtonLink
              href={`/documents?deal=${dealId}`}
              variant="outline"
              size="sm"
            >
              Open document hub
            </ButtonLink>
          ) : (
            <Link
              href="/documents"
              className="text-sm font-medium text-text-primary hover:underline"
            >
              Open document hub
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {documents.map((doc) => {
              const subtitle = documentSubtitle(doc)

              return (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <DocumentStatusIcon status={doc.status} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                      {subtitle ? (
                        <p className="mt-0.5 truncate text-sm text-text-tertiary">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Badge variant="secondary" className={cn(statusClass(doc.status))}>
                      {statusLabel(doc.status)}
                    </Badge>
                    {doc.status === 'review' ? (
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => openDocument(doc)}
                      >
                        Review
                      </Button>
                    ) : null}
                    {doc.status === 'missing' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocument(doc)}
                        >
                          Request
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocument(doc)}
                        >
                          Upload
                        </Button>
                      </>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      <DocumentDetailSheet
        document={selectedDoc}
        dealName={dealName}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
