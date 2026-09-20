export type DocumentStatus = 'complete' | 'missing' | 'review'

export interface Document {
  id: string
  dealId: string
  name: string
  status: DocumentStatus
  required: boolean
  uploadedAt?: string
  party?: string
  fileName?: string
  source?: string
}
