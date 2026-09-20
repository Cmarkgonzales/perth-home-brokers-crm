import { notFound } from 'next/navigation'
import Link from 'next/link'
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

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/approvals" className="hover:text-text-primary">
              Approvals
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">{approval.title}</li>
        </ol>
      </nav>

      <ApprovalReview approval={approval} documents={documents} />
    </div>
  )
}
