import {
  CONTRACT_PROGRESS_CLASS,
  CONTRACT_PROGRESS_LABEL,
} from '@/domain/documents/contract.constants'
import {
  getContractProgress,
  getSignatureProgress,
} from '@/domain/documents/contract-progress'
import type { ContractDocument } from '@/domain/documents/contract.types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ContractSignatureProgressProps {
  contract: ContractDocument
  className?: string
}

export function ContractSignatureProgress ({
  contract,
  className,
}: ContractSignatureProgressProps) {
  const progress = getContractProgress(contract)
  const { signedCount, totalCount } = getSignatureProgress(contract.signatories)
  const percent =
    totalCount === 0 ? 0 : Math.round((signedCount / totalCount) * 100)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className={CONTRACT_PROGRESS_CLASS[progress]}>
          {CONTRACT_PROGRESS_LABEL[progress]}
        </Badge>
        <span className="text-xs tabular-nums text-text-tertiary">
          {signedCount} of {totalCount} signed
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Contract signatures"
      >
        <div
          className="h-full rounded-full bg-text-primary transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
