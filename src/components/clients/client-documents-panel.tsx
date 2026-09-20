'use client'

import { useState } from 'react'
import type { Document } from '@/domain/documents/document.types'
import { DocumentDetailSheet } from '@/components/documents/document-detail-sheet'
import { RequiredDocumentsList } from '@/components/documents/required-documents-list'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ClientDocumentsPanelProps {
  documents: Document[]
  dealId?: string
  dealName: string
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
      <RequiredDocumentsList
        documents={documents}
        showProgress={false}
        onOpenDocument={openDocument}
        headerAction={
          <ButtonLink
            href={dealId ? `/documents/${dealId}` : '/documents'}
            variant="outline"
            size="sm"
          >
            Open documents
          </ButtonLink>
        }
      />

      <DocumentDetailSheet
        document={selectedDoc}
        dealName={dealName}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
