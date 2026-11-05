import type { JSONContent } from '@tiptap/core'
import type { ContractProgress } from '@/domain/documents/contract.types'

export const CONTRACT_PROGRESS_LABEL: Record<ContractProgress, string> = {
  draft: 'Draft',
  awaiting_signatures: 'Awaiting signatures',
  partially_signed: 'Partially signed',
  complete: 'Complete',
}

export const CONTRACT_PROGRESS_CLASS: Record<ContractProgress, string> = {
  draft: 'bg-surface-strong text-text-secondary',
  awaiting_signatures: 'bg-info/10 text-info',
  partially_signed: 'bg-warning/10 text-warning',
  complete: 'bg-success/10 text-success',
}

export const EMPTY_CONTRACT_CONTENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}
