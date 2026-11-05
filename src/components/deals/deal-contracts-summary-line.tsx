'use client'

import Link from 'next/link'
import {
  CONTRACT_PROGRESS_LABEL,
  CONTRACT_PROGRESS_CLASS,
} from '@/domain/documents/contract.constants'
import { getContractProgress, getSignatureProgress } from '@/domain/documents/contract-progress'
import { useContractDocuments } from '@/lib/contracts/contract-documents-context'
import { Badge } from '@/components/ui/badge'

interface DealContractsSummaryLineProps {
  dealId: string
}

export function DealContractsSummaryLine ({
  dealId,
}: DealContractsSummaryLineProps) {
  const { getContractsByDealId, isHydrated } = useContractDocuments()

  if (!isHydrated) {
    return (
      <p className="text-sm text-text-secondary">Loading contract status…</p>
    )
  }
  const contracts = getContractsByDealId(dealId)

  if (contracts.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        No contracts.{' '}
        <Link
          href={`/documents/${dealId}`}
          className="font-medium text-text-primary underline-offset-2 hover:underline"
        >
          Create one
        </Link>
      </p>
    )
  }

  const primary = contracts[0]
  const progress = getContractProgress(primary)
  const { signedCount, totalCount } = getSignatureProgress(primary.signatories)

  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-text-primary">Contracts</span>
        <Badge variant="secondary" className={CONTRACT_PROGRESS_CLASS[progress]}>
          {CONTRACT_PROGRESS_LABEL[progress]}
        </Badge>
      </div>
      <p className="text-sm text-text-secondary">
        {primary.title} — {signedCount} of {totalCount} signed
        {contracts.length > 1 ? ` (+${contracts.length - 1} more)` : ''}
      </p>
      <Link
        href={`/documents/${dealId}/contracts/${primary.id}`}
        className="text-sm font-medium text-text-primary underline-offset-2 hover:underline"
      >
        Open contract editor
      </Link>
    </div>
  )
}
