import Link from 'next/link'
import type { Client } from '@/domain/clients/client.types'
import type { Deal } from '@/domain/deals/deal.types'
import type { Document } from '@/domain/documents/document.types'
import type { DealPackageConfig } from '@/domain/packages/package.types'
import { formatCurrency } from '@/lib/formatting'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface DealWorkspaceHeaderProps {
  deal: Deal
  client?: Client
  documents: Document[]
  packageConfig?: DealPackageConfig
}

export function DealWorkspaceHeader ({
  deal,
  client,
  documents,
  packageConfig,
}: DealWorkspaceHeaderProps) {
  const requiredDocs = documents.filter((doc) => doc.required)
  const verifiedCount = requiredDocs.filter(
    (doc) => doc.status === 'complete'
  ).length
  const documentsIncomplete =
    requiredDocs.length > 0 && verifiedCount < requiredDocs.length

  return (
    <Card className="border-border shadow-none">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="min-w-0 text-2xl font-semibold tracking-tight break-words text-text-primary sm:text-[32px] sm:leading-10">
              {deal.name}
            </h1>
            {deal.atRisk ? (
              <AlertTriangle
                className="size-5 shrink-0 text-danger"
                aria-label="At risk"
              />
            ) : null}
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Deal{' '}
            <span className="font-mono text-text-tertiary">{deal.id}</span>
            {client ? (
              <>
                {' '}
                for{' '}
                <Link
                  href={`/clients/${client.id}`}
                  className="font-medium text-text-primary hover:underline"
                >
                  {client.name}
                </Link>
              </>
            ) : null}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DealStageBadge stage={deal.stage} />
            {requiredDocs.length > 0 ? (
              <Badge
                variant="secondary"
                className={
                  documentsIncomplete
                    ? 'bg-warning/10 text-warning'
                    : 'bg-success/10 text-success'
                }
              >
                {verifiedCount} of {requiredDocs.length} documents verified
              </Badge>
            ) : null}
            {!packageConfig ? (
              <Badge
                variant="secondary"
                className="bg-warning/10 text-warning"
              >
                Package not saved
              </Badge>
            ) : null}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-text-tertiary">Deal value</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-text-primary">
              {formatCurrency(deal.value)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-tertiary">Stage</dt>
            <dd className="mt-1 text-sm font-semibold text-text-primary">
              {DEAL_STAGE_LABELS[deal.stage]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-tertiary">Owner</dt>
            <dd className="mt-1 flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-surface-strong text-[10px] font-semibold text-text-primary">
                  {deal.owner.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-text-primary">
                {deal.owner}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  )
}
