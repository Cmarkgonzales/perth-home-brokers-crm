import type { Document } from '@/domain/documents/document.types'

export interface RequiredDocumentProgress {
  required: Document[]
  requiredCount: number
  verifiedCount: number
  reviewCount: number
  missingCount: number
  progress: number
}

export function getRequiredDocumentProgress (
  documents: Document[]
): RequiredDocumentProgress {
  const required = documents.filter((doc) => doc.required)
  const verifiedCount = required.filter((doc) => doc.status === 'complete').length
  const reviewCount = required.filter((doc) => doc.status === 'review').length
  const missingCount = required.filter((doc) => doc.status === 'missing').length
  const progress =
    required.length === 0
      ? 0
      : Math.round((verifiedCount / required.length) * 100)

  return {
    required,
    requiredCount: required.length,
    verifiedCount,
    reviewCount,
    missingCount,
    progress,
  }
}

export function getDocumentSourceLine (doc: Document): string | null {
  const parts = [
    doc.party,
    doc.fileName,
    doc.source ? `via ${doc.source}` : null,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(', ') : null
}
