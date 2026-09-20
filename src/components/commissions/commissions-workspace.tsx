'use client'

import { useState } from 'react'
import type { Commission, CommissionStatus } from '@/domain/commissions/commission.types'
import { summariseCommissions } from '@/data/demo/commissions'
import { CommissionPreview } from '@/components/commissions/commission-preview'
import { CommissionSummaryCards } from '@/components/commissions/commission-summary-cards'
import { CommissionTable } from '@/components/commissions/commission-table'

interface CommissionsWorkspaceProps {
  commissions: Commission[]
  initialDealId?: string
}

export function CommissionsWorkspace ({
  commissions,
  initialDealId,
}: CommissionsWorkspaceProps) {
  const [items, setItems] = useState(commissions)
  const initial =
    items.find((commission) => commission.dealId === initialDealId) ??
    items[0]
  const [selectedId, setSelectedId] = useState(initial?.id)
  const selected =
    items.find((commission) => commission.id === selectedId) ??
    items[0] ??
    null
  const summary = summariseCommissions(items)

  function handleStatusChange (
    commissionId: string,
    status: CommissionStatus
  ) {
    setItems((current) =>
      current.map((commission) =>
        commission.id === commissionId
          ? { ...commission, status }
          : commission
      )
    )
  }

  return (
    <>
      <CommissionSummaryCards summary={summary} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <CommissionTable
          commissions={items}
          selectedId={selected?.id}
          onSelect={setSelectedId}
        />
        <div className="lg:sticky lg:top-0">
          <CommissionPreview
            commission={selected}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </>
  )
}
