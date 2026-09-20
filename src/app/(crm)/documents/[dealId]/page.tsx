import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDealDocumentsDetail } from '@/data/demo'
import { DealDocumentsDetail } from '@/components/documents/deal-documents-detail'

export default async function DealDocumentsPage ({
  params,
}: PageProps<'/documents/[dealId]'>) {
  const { dealId } = await params
  const detail = getDealDocumentsDetail(dealId)

  if (!detail) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/documents" className="hover:text-text-primary">
              Documents
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">{detail.deal.name}</li>
        </ol>
      </nav>

      <DealDocumentsDetail
        deal={detail.deal}
        documents={detail.documents}
      />
    </div>
  )
}
