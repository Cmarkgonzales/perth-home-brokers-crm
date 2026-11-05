import { ContractEditorWorkspace } from '@/components/documents/contract-editor-workspace'
import { PageHeader } from '@/components/layout/page-header'

export default async function ContractEditorPage ({
  params,
}: PageProps<'/documents/[dealId]/contracts/[contractId]'>) {
  const { dealId, contractId } = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contract editor"
        description="Create and edit contract content, manage signatories, and track signature progress."
      />
      <ContractEditorWorkspace dealId={dealId} contractId={contractId} />
    </div>
  )
}
