'use client'

import type { ResolvedPackageTemplate } from '@/domain/packages/package-template-utils'
import { formatCurrency } from '@/lib/formatting'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { BedDouble, Car, Home, ShowerHead } from 'lucide-react'
import { PackageTemplatePreview } from '@/components/packages/package-template-preview'
interface PackageTemplateCardProps {
  template: ResolvedPackageTemplate
  onApply: (template: ResolvedPackageTemplate) => void
}

export function PackageTemplateCard ({
  template,
  onApply,
}: PackageTemplateCardProps) {
  const { design, land } = template

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-none">
      <PackageTemplatePreview template={template} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              {template.name}
            </h3>
            <p className="mt-0.5 text-xs text-text-tertiary">
              {design.builder} · {land.suburb}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 capitalize">
            {template.origin}
          </Badge>
        </div>

        <ul className="flex flex-wrap gap-3 text-xs text-text-secondary">
          <li className="inline-flex items-center gap-1">
            <Home className="size-3.5 text-phb-red" aria-hidden />
            {design.houseWidth}m
          </li>
          <li className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" aria-hidden />
            {design.bedrooms}
          </li>
          <li className="inline-flex items-center gap-1">
            <ShowerHead className="size-3.5" aria-hidden />
            {design.bathrooms}
          </li>
          <li className="inline-flex items-center gap-1">
            <Car className="size-3.5" aria-hidden />
            {design.cars}
          </li>
        </ul>

        <p className="text-sm leading-relaxed text-text-secondary">
          {design.summary}
        </p>

        {template.includedExtras.length > 0 ? (
          <p className="text-xs font-medium text-text-tertiary">
            {template.includedExtras.length} upgrade
            {template.includedExtras.length === 1 ? '' : 's'} included in template
          </p>
        ) : null}

        <p className="text-lg font-semibold tabular-nums text-text-primary">
          {formatCurrency(template.total)}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            variant="brand"
            size="sm"
            onClick={() => onApply(template)}
          >
            Use on deal
          </Button>
          {template.origin === 'custom' ? (
            <ButtonLink
              href={`/packages/templates/${template.id}`}
              variant="outline"
              size="sm"
            >
              Edit
            </ButtonLink>
          ) : (
            <ButtonLink
              href={`/packages/templates/${template.id}`}
              variant="outline"
              size="sm"
            >
              View
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  )
}
