import { getDocumentsGroupedByDeal } from '@/data/demo'
import { PageHeader } from '@/components/layout/page-header'
import { DocumentsHub } from '@/components/documents/documents-hub'

export default async function DocumentsPage ({
  searchParams,
}: PageProps<'/documents'>) {
  const { deal } = await searchParams
  const dealFilter = typeof deal === 'string' ? deal : undefined
  const groups = getDocumentsGroupedByDeal()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Track required documents across all deals."
      />

      <DocumentsHub groups={groups} initialDealFilter={dealFilter} />
    </div>
  )
}
