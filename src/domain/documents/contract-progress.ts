import type { JSONContent } from '@tiptap/core'
import type {
  ContractDocument,
  ContractProgress,
  ContractSignatory,
} from '@/domain/documents/contract.types'

export interface SignatureProgress {
  signedCount: number
  totalCount: number
}

export function extractTextFromContent (content: JSONContent): string {
  const parts: string[] = []

  function walk (node: JSONContent) {
    if (node.type === 'text' && typeof node.text === 'string') {
      parts.push(node.text)
    }
    if (node.content) {
      for (const child of node.content) {
        walk(child)
      }
    }
  }

  walk(content)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

export function isContractBodyEmpty (content: JSONContent): boolean {
  return extractTextFromContent(content).length === 0
}

export function hasRequiredSignatories (
  signatories: ContractSignatory[]
): boolean {
  const hasSender = signatories.some((s) => s.role === 'sender')
  const hasRecipient = signatories.some((s) => s.role === 'recipient')
  return hasSender && hasRecipient
}

export function getSignatureProgress (
  signatories: ContractSignatory[]
): SignatureProgress {
  const totalCount = signatories.length
  const signedCount = signatories.filter((s) => s.status === 'signed').length
  return { signedCount, totalCount }
}

export function getContractProgress (contract: ContractDocument): ContractProgress {
  const bodyReady = !isContractBodyEmpty(contract.content)
  const partiesReady = hasRequiredSignatories(contract.signatories)

  if (!bodyReady || !partiesReady) {
    return 'draft'
  }

  const { signedCount, totalCount } = getSignatureProgress(contract.signatories)

  if (signedCount === 0) {
    return 'awaiting_signatures'
  }

  if (signedCount < totalCount) {
    return 'partially_signed'
  }

  return 'complete'
}

export function getContractExcerpt (
  content: JSONContent,
  maxLength = 120
): string {
  const text = extractTextFromContent(content)
  if (text.length === 0) {
    return 'No contract content yet.'
  }
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength).trim()}…`
}

export function clearAllSignatures (
  signatories: ContractSignatory[]
): ContractSignatory[] {
  return signatories.map((signatory) => ({
    ...signatory,
    status: 'pending' as const,
    signature: undefined,
    signedAt: undefined,
  }))
}

export function applyBodyEditToContract (
  contract: ContractDocument,
  newContent: JSONContent,
  updatedAt: string
): ContractDocument {
  const hadSignatures = contract.signatories.some((s) => s.status === 'signed')

  return {
    ...contract,
    content: newContent,
    updatedAt,
    signatories: hadSignatures
      ? clearAllSignatures(contract.signatories)
      : contract.signatories,
  }
}

export function applyReviseContract (
  contract: ContractDocument,
  updatedAt: string
): ContractDocument {
  return {
    ...contract,
    updatedAt,
    signatories: clearAllSignatures(contract.signatories),
  }
}
