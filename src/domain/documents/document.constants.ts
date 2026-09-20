import type { DocumentStatus } from '@/domain/documents/document.types'

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  complete: 'Verified',
  review: 'Needs review',
  missing: 'Missing',
}

export const DOCUMENT_STATUS_CLASS: Record<DocumentStatus, string> = {
  complete: 'bg-success/10 text-success',
  review: 'bg-warning/10 text-warning',
  missing: 'bg-danger/10 text-danger',
}
