export type DocumentStatus = 'complete' | 'missing' | 'review'

export interface Document {
  id: string
  dealId: string
  name: string
  status: DocumentStatus
  uploadedAt?: string
}
