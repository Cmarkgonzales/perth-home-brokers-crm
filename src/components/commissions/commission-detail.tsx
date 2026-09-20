'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Commission } from '@/domain/commissions/commission.types'
import { formatCurrency } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CommissionDetailProps {
  commission: Commission
}

const statusStyles: Record<Commission['status'], string> = {
  pipeline: 'bg-surface-strong text-text-secondary',
  expected: 'bg-warning/10 text-warning',
  paid: 'bg-success/10 text-success',
}

const statusLabels: Record<Commission['status'], string> = {
  pipeline: 'Pipeline',
  expected: 'Expected',
  paid: 'Paid',
}

export function CommissionDetail ({ commission }: CommissionDetailProps) {
  const [status, setStatus] = useState(commission.status)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleMarkPaid () {
    setStatus('paid')
    setConfirmOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/commissions"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to commissions
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight break-words text-text-primary sm:text-[32px]">
              {commission.dealName}
            </h1>
            <p className="text-sm text-text-secondary">
              {commission.dealId} · {commission.consultant}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn('font-normal', statusStyles[status])}
          >
            {statusLabels[status]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Deal value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deal value</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(commission.dealValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission rule</span>
              <span>{(commission.commissionRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="font-medium">Gross commission</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(commission.grossCommission)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Split</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>{commission.consultant} (70%)</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(commission.consultantAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Office (30%)</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(commission.officeAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {status !== 'paid' && (
        <Button
          className="bg-phb-yellow text-text-primary hover:bg-phb-yellow-dark"
          onClick={() => setConfirmOpen(true)}
        >
          Mark paid
        </Button>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark commission as paid?</DialogTitle>
            <DialogDescription>
              This will update the commission status for {commission.dealName}.
              Demo action only — no persistence.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-phb-yellow text-text-primary hover:bg-phb-yellow-dark"
              onClick={handleMarkPaid}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
