import { PackageTemplateFormClient } from '@/components/packages/package-template-form-client'

export default async function NewPackageTemplatePage ({
  searchParams,
}: {
  searchParams: Promise<{ duplicateFrom?: string | string[] }>
}) {
  const params = await searchParams
  const duplicateFrom =
    typeof params.duplicateFrom === 'string' ? params.duplicateFrom : undefined

  return (
    <PackageTemplateFormClient mode="create" duplicateFromId={duplicateFrom} />
  )
}
