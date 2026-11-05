import { getCatalogTemplateById } from '@/data/demo/packages'
import { PackageTemplateFormClient } from '@/components/packages/package-template-form-client'

export default async function PackageTemplateDetailPage ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const catalog = getCatalogTemplateById(id)

  return (
    <PackageTemplateFormClient
      templateId={id}
      mode={catalog ? 'view' : undefined}
    />
  )
}
