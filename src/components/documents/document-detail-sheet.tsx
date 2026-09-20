'use client'

import type { Document } from '@/domain/documents/document.types'
import { formatDate } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Upload } from 'lucide-react'

interface DocumentDetailSheetProps {
  document: Document | null
  dealName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function statusClass (status: Document['status']) {
  if (status === 'missing') return 'bg-danger/10 text-danger'
  if (status === 'review') return 'bg-warning/10 text-warning'
  return 'bg-success/10 text-success'
}

export function DocumentDetailSheet ({
  document,
  dealName,
  open,
  onOpenChange,
}: DocumentDetailSheetProps) {
  if (!document) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{document.name}</SheetTitle>
          <SheetDescription>{dealName}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Status</span>
            <Badge variant="secondary" className={statusClass(document.status)}>
              {document.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Required</span>
            <span>{document.required ? 'Yes' : 'No'}</span>
          </div>
          {document.uploadedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Uploaded</span>
              <span>{formatDate(document.uploadedAt)}</span>
            </div>
          )}

          {document.status === 'missing' && (
            <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-6 text-center">
              <Upload className="mx-auto mb-2 size-8 text-text-tertiary" aria-hidden />
              <p className="text-sm font-medium">Upload document</p>
              <p className="mt-1 text-xs text-text-tertiary">
                Drag and drop or click to browse. Upload is UI-only in this prototype.
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Choose file
              </Button>
            </div>
          )}

          {document.status === 'review' && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
              <p className="font-medium text-warning">Pending review</p>
              <p className="mt-1 text-text-secondary">
                This document requires broker verification before approval can proceed.
              </p>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
