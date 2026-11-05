'use client'

import {
  demoHouseDesigns,
  demoLandLots,
} from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import { ButtonLink } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getMergedHouseDesigns,
  usePackageWorkspace,
} from '@/components/packages/use-package-workspace'

interface DealPackageSummaryProps {
  dealId: string
}

function PackageRow ({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd
        className={
          emphasize
            ? 'text-sm font-semibold tabular-nums text-text-primary'
            : 'text-right text-sm font-medium text-text-primary'
        }
      >
        {value}
      </dd>
    </div>
  )
}

export function DealPackageSummary ({ dealId }: DealPackageSummaryProps) {
  const { getDealPackage, getTemplate, state } = usePackageWorkspace()
  const packageConfig = getDealPackage(dealId)
  const builderHref = `/packages/builder?dealId=${dealId}`

  const designs = getMergedHouseDesigns(state)

  if (!packageConfig) {
    return (
      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Package</CardTitle>
          <CardAction>
            <ButtonLink
              href={builderHref}
              variant="ghost"
              size="sm"
              className="text-text-secondary"
            >
              Open builder
            </ButtonLink>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary">
            No package configured yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  const land = demoLandLots.find((lot) => lot.id === packageConfig.landId)
  const design =
    designs.find((item) => item.id === packageConfig.designId) ??
    demoHouseDesigns.find((item) => item.id === packageConfig.designId)
  const template = packageConfig.templateId
    ? getTemplate(packageConfig.templateId)
    : undefined

  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Package</CardTitle>
        <CardAction>
          <ButtonLink
            href={builderHref}
            variant="ghost"
            size="sm"
            className="text-text-secondary"
          >
            Open builder
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        {template ? (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="text-sm text-text-secondary">
              Template:{' '}
              <span className="font-medium text-text-primary">
                {template.name}
              </span>
            </p>
            {packageConfig.customized ? (
              <Badge variant="outline" className="text-warning">
                Customized
              </Badge>
            ) : null}
          </div>
        ) : null}
        <dl>
          {land ? (
            <PackageRow
              label="Land"
              value={`${land.suburb}, ${land.size}`}
            />
          ) : null}
          {design ? (
            <PackageRow label="Builder" value={design.builder} />
          ) : null}
          {design ? (
            <PackageRow label="Design" value={design.name} />
          ) : null}
          <PackageRow
            label="Total"
            value={formatCurrency(packageConfig.total)}
            emphasize
          />
        </dl>
      </CardContent>
    </Card>
  )
}
