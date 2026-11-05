'use client'

import { getCatalogTemplateById } from '@/data/demo/packages'
import type { PackageTemplate } from '@/domain/packages/package.types'
import { PackageTemplateForm } from '@/components/packages/package-template-form'
import {
  getMergedHouseDesigns,
  usePackageWorkspace,
} from '@/components/packages/use-package-workspace'

interface PackageTemplateFormClientProps {
  mode?: 'create' | 'view'
  templateId?: string
  duplicateFromId?: string
}

export function PackageTemplateFormClient ({
  mode: modeProp,
  templateId,
  duplicateFromId,
}: PackageTemplateFormClientProps) {
  const { state, getTemplate } = usePackageWorkspace()

  const lookupId = duplicateFromId ?? templateId
  const catalog = lookupId ? getCatalogTemplateById(lookupId) : undefined
  const fromStore = lookupId ? getTemplate(lookupId) : undefined
  const resolved = fromStore ?? catalog

  const designs = getMergedHouseDesigns(state)
  const design = resolved
    ? designs.find((item) => item.id === resolved.designId)
    : undefined

  if (templateId && !duplicateFromId && !resolved) {
    return (
      <p className="text-sm text-text-secondary">Template not found.</p>
    )
  }

  if (duplicateFromId && !resolved) {
    return (
      <p className="text-sm text-text-secondary">Source template not found.</p>
    )
  }

  let mode: 'create' | 'edit' | 'view' = 'create'
  let template: PackageTemplate | undefined

  if (duplicateFromId && resolved) {
    mode = 'create'
    template = {
      ...resolved,
      name: `${resolved.name} (copy)`,
      origin: 'custom',
      id: 'pending-new',
    }
  } else if (!templateId) {
    mode = 'create'
  } else if (resolved?.origin === 'catalog' || modeProp === 'view') {
    mode = 'view'
    template = resolved
  } else if (resolved?.origin === 'custom') {
    mode = 'edit'
    template = resolved
  }

  return (
    <PackageTemplateForm mode={mode} template={template} design={design} />
  )
}
