import { getPendingApprovals } from '@/data/demo'
import { PageHeader } from '@/components/layout/page-header'
import { ApprovalQueue } from '@/components/approvals/approval-queue'

export default function ApprovalsPage () {
  const pendingApprovals = getPendingApprovals()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Finance, land, and builder approvals pending review."
      />

      <ApprovalQueue approvals={pendingApprovals} />
    </div>
  )
}
