import type { JSONContent } from '@tiptap/core'

export type ContractSignatoryRole = 'sender' | 'recipient' | 'other'

export type ContractSignatoryStatus = 'pending' | 'signed'

export type ContractSignatureKind = 'typed' | 'drawn'

export interface ContractSignature {
  kind: ContractSignatureKind
  value: string
}

export interface ContractSignatory {
  id: string
  role: ContractSignatoryRole
  name: string
  email: string
  status: ContractSignatoryStatus
  signature?: ContractSignature
  signedAt?: string
}

export type ContractSource = 'created' | 'uploaded'

export interface ContractDocument {
  id: string
  dealId: string
  title: string
  content: JSONContent
  signatories: ContractSignatory[]
  source: ContractSource
  originalFileName?: string
  updatedAt: string
}

export type ContractProgress =
  | 'draft'
  | 'awaiting_signatures'
  | 'partially_signed'
  | 'complete'
