'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { DocumentsByDeal } from '@/data/demo/helpers'
import type { Document } from '@/domain/documents/document.types'
import { DocumentDetailSheet } from '@/components/documents/document-detail-sheet'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentsHubProps {
  groups: DocumentsByDeal[]
  initialDealFilter?: string
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

export function DocumentsHub ({ groups, initialDealFilter }: DocumentsHubProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [selectedDealName, setSelectedDealName] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filteredGroups = initialDealFilter
    ? groups.filter((group) => group.dealId === initialDealFilter)
    : groups

  function openDocument (doc: Document, dealName: string) {
    setSelectedDoc(doc)
    setSelectedDealName(dealName)
    setSheetOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        {initialDealFilter && (
          <p className="text-sm text-text-secondary">
            Showing documents for deal{' '}
            <span className="font-mono">{initialDealFilter}</span>
            {' · '}
            <Link href="/documents" className="text-text-primary hover:underline">
              View all
            </Link>
          </p>
        )}

        {filteredGroups.map((group) => {
          const required = group.documents.filter((doc) => doc.required)
          const uploaded = required.filter((doc) => doc.status !== 'missing')

          return (
            <Card key={group.dealId} className="border-border shadow-none">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {group.dealName}
                  </CardTitle>
                  <p className="text-sm text-text-secondary">
                    {group.clientName} ·{' '}
                    <Link
                      href={`/deals/${group.dealId}`}
                      className="font-mono text-text-tertiary hover:underline"
                    >
                      {group.dealId}
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {group.missingCount > 0 && (
                    <Badge variant="secondary" className="bg-danger/10 text-danger">
                      {group.missingCount} missing
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {uploaded.length}/{required.length} required
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {group.documents.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        onClick={() => openDocument(doc, group.dealName)}
                        className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm transition-colors hover:bg-table-hover rounded-lg px-2 -mx-2"
                      >
                        <span className="inline-flex items-center gap-2">
                          <DocumentStatusIcon status={doc.status} />
                          <span className="font-medium">{doc.name}</span>
                          {doc.required && (
                            <span className="text-xs text-text-tertiary">
                              Required
                            </span>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              doc.status === 'missing' && 'bg-danger/10 text-danger',
                              doc.status === 'review' && 'bg-warning/10 text-warning',
                              doc.status === 'complete' && 'bg-success/10 text-success'
                            )}
                          >
                            {doc.status}
                          </Badge>
                          <FileText className="size-4 text-text-tertiary" aria-hidden />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <DocumentDetailSheet
        document={selectedDoc}
        dealName={selectedDealName}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
