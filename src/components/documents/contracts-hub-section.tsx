'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { demoDeals } from '@/data/demo/deals'
import { getContractExcerpt } from '@/domain/documents/contract-progress'
import { useContractDocuments } from '@/lib/contracts/contract-documents-context'
import { ContractSignatureProgress } from '@/components/documents/contract-signature-progress'
import { ButtonLink } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function dealNameForId (dealId: string): string {
  return demoDeals.find((d) => d.id === dealId)?.name ?? dealId
}

export function ContractsHubSection () {
  const { contracts, isHydrated } = useContractDocuments()

  const rows = useMemo(
    () =>
      [...contracts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [contracts]
  )

  if (!isHydrated) {
    return (
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-text-primary">Contracts</h2>
        <Card className="border-border shadow-none">
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Loading contracts…
          </p>
        </Card>
      </section>
    )
  }

  if (rows.length === 0) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary">
            Contracts
          </h2>
        </div>
        <Card className="border-border shadow-none">
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No contracts yet. Open a deal to create one.
          </p>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Contracts
          </h2>
          <p className="text-sm text-text-secondary">
            Signature-based progress for sender and recipient agreements.
          </p>
        </div>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <ul className="divide-y divide-border md:hidden">
          {rows.map((contract) => (
            <li key={contract.id}>
              <Link
                href={`/documents/${contract.dealId}/contracts/${contract.id}`}
                className="block p-4 transition-colors hover:bg-table-hover focus-visible:bg-table-hover focus-visible:outline-none"
              >
                <p className="font-medium text-text-primary">{contract.title}</p>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {dealNameForId(contract.dealId)}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-text-tertiary">
                  {getContractExcerpt(contract.content)}
                </p>
                <div className="mt-3">
                  <ContractSignatureProgress contract={contract} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Signatures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((contract) => (
                <TableRow key={contract.id} className="relative">
                  <TableCell>
                    <Link
                      href={`/documents/${contract.dealId}/contracts/${contract.id}`}
                      className="font-medium text-text-primary after:absolute after:inset-0 hover:text-text-primary"
                    >
                      {contract.title}
                    </Link>
                    {contract.originalFileName ? (
                      <p className="font-mono text-xs text-text-tertiary">
                        from {contract.originalFileName}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>{dealNameForId(contract.dealId)}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm text-text-secondary">
                      {getContractExcerpt(contract.content)}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-48">
                    <ContractSignatureProgress contract={contract} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </section>
  )
}

export function ContractsHubDealLink ({ dealId }: { dealId: string }) {
  return (
    <ButtonLink href={`/documents/${dealId}`} variant="outline" size="sm">
      Manage on deal
    </ButtonLink>
  )
}
