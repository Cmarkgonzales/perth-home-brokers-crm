'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Approval, ApprovalStatus } from '@/domain/approvals/approval.types'
import type { Document } from '@/domain/documents/document.types'
import {
  DOCUMENT_STATUS_CLASS,
  DOCUMENT_STATUS_LABEL,
} from '@/domain/documents/document.constants'
import { formatCurrency, formatDate } from '@/lib/formatting'
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
import { AiApprovalSummary } from '@/components/ai/ai-approval-summary'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface ApprovalReviewProps {
  approval: Approval
  documents: Document[]
}

function DocumentStatusIcon ({ status }: { status: Document['status'] }) {
  if (status === 'complete') {
    return <CheckCircle2 className="size-4 text-success" aria-hidden />
  }
  if (status === 'missing') {
    return <AlertCircle className="size-4 text-danger" aria-hidden />
  }
  return <Clock className="size-4 text-warning" aria-hidden />
}

const statusLabels: Record<ApprovalStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  changes_requested: 'Changes requested',
  rejected: 'Rejected',
}

export function ApprovalReview ({ approval, documents }: ApprovalReviewProps) {
  const [status, setStatus] = useState<ApprovalStatus>(approval.status)
  const [confirmAction, setConfirmAction] = useState<ApprovalStatus | null>(null)

  function handleAction (nextStatus: ApprovalStatus) {
    setStatus(nextStatus)
    setConfirmAction(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight break-words text-text-primary sm:text-[32px]">
            {approval.title}
          </h1>
          <p className="text-sm text-text-secondary">
            {approval.clientName} ·{' '}
            <Link
              href={`/deals/${approval.dealId}`}
              className="font-mono hover:underline"
            >
              {approval.dealId}
            </Link>
          </p>
        </div>
        <Badge
          variant="secondary"
          className={
            status === 'approved'
              ? 'bg-success/10 text-success'
              : status === 'rejected'
                ? 'bg-danger/10 text-danger'
                : status === 'changes_requested'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-info/10 text-info'
          }
        >
          {statusLabels[status]}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Request details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{approval.description}</p>
            <div className="space-y-1 border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Deal value</span>
                <span className="font-medium">
                  {formatCurrency(approval.dealValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Requested</span>
                <span>{formatDate(approval.requestedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Due</span>
                <span>{formatDate(approval.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Assignee</span>
                <span>{approval.assignee}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Attached documents</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents attached.
              </p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="inline-flex items-center gap-2">
                      <DocumentStatusIcon status={doc.status} />
                      {doc.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={DOCUMENT_STATUS_CLASS[doc.status]}
                    >
                      {DOCUMENT_STATUS_LABEL[doc.status]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <AiApprovalSummary approvalId={approval.id} />

      {status === 'pending' && (
        <div className="flex flex-wrap gap-2">
          <Button variant="brand" onClick={() => setConfirmAction('approved')}>
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmAction('changes_requested')}
          >
            Request changes
          </Button>
          <Button
            variant="destructive"
            onClick={() => setConfirmAction('rejected')}
          >
            Reject
          </Button>
        </div>
      )}

      {status !== 'pending' && (
        <Card className="border-border bg-surface-muted shadow-none">
          <CardContent className="py-4 text-sm text-text-secondary">
            This approval has been marked as{' '}
            <span className="font-medium text-text-primary">
              {statusLabels[status]}
            </span>
            .
          </CardContent>
        </Card>
      )}

      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approved' && 'Approve request'}
              {confirmAction === 'changes_requested' && 'Request changes'}
              {confirmAction === 'rejected' && 'Reject request'}
            </DialogTitle>
            <DialogDescription>
              Confirm to approve, request changes, or reject the request.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction === 'rejected' ? 'destructive' : 'brand'}
              onClick={() => confirmAction && handleAction(confirmAction)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
