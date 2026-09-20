import { notFound } from 'next/navigation'
import {
  getApprovalById,
  getDocumentById,
} from '@/data/demo'
import { ApprovalReview } from '@/components/approvals/approval-review'

export default async function ApprovalDetailPage ({
  params,
}: PageProps<'/approvals/[id]'>) {
  const { id } = await params
  const approval = getApprovalById(id)

  if (!approval) {
    notFound()
  }

  const documents = approval.documentIds
    .map((docId) => getDocumentById(docId))
    .filter((doc): doc is NonNullable<typeof doc> => doc !== undefined)

  return <ApprovalReview approval={approval} documents={documents} />
}
