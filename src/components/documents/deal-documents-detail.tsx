'use client'

import { useState } from 'react'
import type { Deal } from '@/domain/deals/deal.types'
import type { Document } from '@/domain/documents/document.types'
import { DealDocumentsAiPanel } from '@/components/documents/deal-documents-ai-panel'
import { DocumentDetailSheet } from '@/components/documents/document-detail-sheet'
import { RequiredDocumentsList } from '@/components/documents/required-documents-list'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DealDocumentsDetailProps {
  deal: Deal
  documents: Document[]
}

export function DealDocumentsDetail ({
  deal,
  documents,
}: DealDocumentsDetailProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  function openDocument (doc: Document) {
    setSelectedDoc(doc)
    setSheetOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{deal.name}.</span>{' '}
            Documents from email, WhatsApp, text and scans land in one place.
          </p>
          <ButtonLink
            href={`/deals/${deal.id}`}
            variant="outline"
            className="shrink-0"
          >
            Back to deal
          </ButtonLink>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <RequiredDocumentsList
            documents={documents}
            onOpenDocument={openDocument}
          />

          <aside className="space-y-5">
            <DealDocumentsAiPanel
              documents={documents}
              onReview={openDocument}
            />
            <Card className="border-border shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Where documents come from
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-text-secondary">
                Clients send files by email, WhatsApp, SMS and paper. Each one is
                matched to the right deal and requirement here.
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <DocumentDetailSheet
        document={selectedDoc}
        dealName={deal.name}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
