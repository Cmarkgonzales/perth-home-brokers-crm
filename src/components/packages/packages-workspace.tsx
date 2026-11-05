'use client'

import { useMemo, useState } from 'react'
import type { Deal } from '@/domain/deals/deal.types'
import {
  DEFAULT_PACKAGE_TEMPLATE_FILTERS,
  type PackageTemplateFilters,
} from '@/domain/packages/package.types'
import {
  filterPackageTemplates,
  resolvePackageTemplates,
} from '@/domain/packages/package-template-utils'
import { demoLandLots, demoPackageExtras } from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import { PageHeader } from '@/components/layout/page-header'
import { ApplyTemplateDialog } from '@/components/packages/apply-template-dialog'
import { PackageTemplateCard } from '@/components/packages/package-template-card'
import { PackageTemplateFiltersBar } from '@/components/packages/package-template-filters'
import { usePackageWorkspace } from '@/components/packages/use-package-workspace'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ResolvedPackageTemplate } from '@/domain/packages/package-template-utils'

interface PackagesWorkspaceProps {
  activeDeals: Deal[]
}

export function PackagesWorkspace ({ activeDeals }: PackagesWorkspaceProps) {
  const { templates, houseDesigns, getDealPackage, getTemplate } =
    usePackageWorkspace()
  const [filters, setFilters] = useState<PackageTemplateFilters>({
    ...DEFAULT_PACKAGE_TEMPLATE_FILTERS,
  })
  const [applyTarget, setApplyTarget] =
    useState<ResolvedPackageTemplate | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)

  const resolved = useMemo(
    () =>
      resolvePackageTemplates(
        templates,
        houseDesigns,
        demoLandLots,
        demoPackageExtras
      ),
    [templates, houseDesigns]
  )

  const filtered = useMemo(
    () => filterPackageTemplates(resolved, filters),
    [resolved, filters]
  )

  const houseWidthOptions = useMemo(
    () =>
      [...new Set(houseDesigns.map((design) => design.houseWidth))].sort(
        (a, b) => a - b
      ),
    [houseDesigns]
  )

  const bedroomOptions = useMemo(
    () =>
      [...new Set(houseDesigns.map((design) => design.bedrooms))].sort(
        (a, b) => a - b
      ),
    [houseDesigns]
  )

  function openApply (template: ResolvedPackageTemplate) {
    setApplyTarget(template)
    setApplyOpen(true)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Packages"
        description="Browse house and land templates and assign packages to active deals."
        actions={
          <ButtonLink href="/packages/templates/new" variant="brand" size="sm">
            Create template
          </ButtonLink>
        }
      />

      <section className="space-y-4" aria-labelledby="template-library-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="template-library-heading"
            className="text-lg font-semibold text-text-primary"
          >
            Template library
          </h2>
          <PackageTemplateFiltersBar
            filters={filters}
            houseWidthOptions={houseWidthOptions}
            bedroomOptions={bedroomOptions}
            onChange={setFilters}
          />
        </div>

        {filtered.length === 0 ? (
          <Card className="border-border shadow-none">
            <CardContent className="py-10 text-center text-sm text-text-secondary">
              No templates match these filters. Try resetting or create a custom
              template.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((template) => (
              <PackageTemplateCard
                key={template.id}
                template={template}
                onApply={openApply}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="deal-packages-heading">
        <h2
          id="deal-packages-heading"
          className="text-lg font-semibold text-text-primary"
        >
          Deal packages
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeDeals.map((deal) => {
            const pkg = getDealPackage(deal.id)
            const template = pkg?.templateId
              ? getTemplate(pkg.templateId)
              : undefined

            return (
              <Card key={deal.id} className="border-border shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {deal.name}
                  </CardTitle>
                  <p className="font-mono text-xs text-text-tertiary">
                    {deal.id}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DealStageBadge stage={deal.stage} />
                  {pkg ? (
                    <div className="space-y-1 text-sm text-text-secondary">
                      {template ? (
                        <p>
                          Template:{' '}
                          <span className="font-medium text-text-primary">
                            {template.name}
                          </span>
                        </p>
                      ) : null}
                      <p>
                        Total:{' '}
                        <span className="font-semibold text-text-primary">
                          {formatCurrency(pkg.total)}
                        </span>
                      </p>
                      {pkg.customized ? (
                        <p className="text-xs font-medium text-warning">
                          Customized for this deal
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">
                      No package configured
                    </p>
                  )}
                  <ButtonLink
                    href={`/packages/builder?dealId=${deal.id}`}
                    variant="brand"
                    size="sm"
                  >
                    {pkg ? 'Edit package' : 'Configure package'}
                  </ButtonLink>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <ApplyTemplateDialog
        template={applyTarget}
        deals={activeDeals}
        open={applyOpen}
        onOpenChange={setApplyOpen}
      />
    </div>
  )
}
