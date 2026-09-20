'use client'

import { useState } from 'react'
import type { Commission, CommissionStatus } from '@/domain/commissions/commission.types'
import { COMMISSION_STATUS_LABEL } from '@/domain/commissions/commission.constants'
import { formatCurrency } from '@/lib/formatting'
import { CommissionStatusBadge } from '@/components/commissions/commission-status-badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CommissionPreviewProps {
  commission: Commission | null
  onStatusChange: (commissionId: string, status: CommissionStatus) => void
}

function DetailRow ({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="text-right text-sm font-medium tabular-nums text-text-primary">
        {value}
      </dd>
    </div>
  )
}

export function CommissionPreview ({
  commission,
  onStatusChange,
}: CommissionPreviewProps) {
  const [pendingStatus, setPendingStatus] = useState<CommissionStatus | null>(
    null
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!commission) {
    return (
      <Card className="border-border shadow-none">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Select a commission to see the split.
        </CardContent>
      </Card>
    )
  }

  const ratePercent =
    Math.round(commission.commissionRate * 1000) / 10
  const consultantSplit = commission.grossCommission
    ? Math.round(
        (commission.consultantAmount / commission.grossCommission) * 100
      )
    : 0
  const officeSplit = 100 - consultantSplit
  const canMarkExpected = commission.status === 'pipeline'
  const canMarkPaid = commission.status !== 'paid'
  const selectedCommission = commission
  const pendingLabel = pendingStatus
    ? COMMISSION_STATUS_LABEL[pendingStatus].toLowerCase()
    : ''

  function requestStatusChange (status: CommissionStatus) {
    setPendingStatus(status)
    setConfirmOpen(true)
  }

  function closeConfirm () {
    setConfirmOpen(false)
  }

  function confirmStatusChange () {
    if (!pendingStatus) return
    onStatusChange(selectedCommission.id, pendingStatus)
    setConfirmOpen(false)
  }

  return (
    <>
      <Card className="border-border shadow-none">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">
              {commission.dealName}
            </CardTitle>
            <p className="mt-1 text-sm text-text-secondary">
              Consultant: {commission.consultant}
            </p>
          </div>
          <CommissionStatusBadge status={commission.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <dl>
            <DetailRow
              label="Deal value"
              value={formatCurrency(commission.dealValue)}
            />
            <DetailRow label="Commission rule" value={`${ratePercent}%`} />
            <DetailRow
              label="Gross commission"
              value={formatCurrency(commission.grossCommission)}
            />
          </dl>

          <div className="border-t border-border pt-3">
            <p className="mb-2 text-sm font-medium text-text-primary">Split</p>
            <dl>
              <DetailRow
                label={`${commission.consultant}, ${consultantSplit}%`}
                value={formatCurrency(commission.consultantAmount)}
              />
              <DetailRow
                label={`Office, ${officeSplit}%`}
                value={formatCurrency(commission.officeAmount)}
              />
            </dl>
          </div>

          <div className="flex flex-wrap gap-2">
            {canMarkExpected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => requestStatusChange('expected')}
              >
                Mark expected
              </Button>
            ) : null}
            {canMarkPaid ? (
              <Button
                variant="brand"
                size="sm"
                onClick={() => requestStatusChange('paid')}
              >
                Mark paid
              </Button>
            ) : null}
            <ButtonLink
              href={`/deals/${commission.dealId}`}
              variant="outline"
              size="sm"
            >
              Open deal
            </ButtonLink>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open)
          if (!open) setPendingStatus(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === 'expected'
                ? 'Mark commission as expected?'
                : 'Mark commission as paid?'}
            </DialogTitle>
            <DialogDescription>
              {`This will update ${commission.dealName} to ${pendingLabel}.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button variant="brand" onClick={confirmStatusChange}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
