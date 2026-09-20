import type { DealPackageConfig } from '@/domain/packages/package.types'
import {
  demoHouseDesigns,
  demoLandLots,
} from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, MapPin } from 'lucide-react'

interface DealPackageSummaryProps {
  dealId: string
  packageConfig?: DealPackageConfig
}

export function DealPackageSummary ({
  dealId,
  packageConfig,
}: DealPackageSummaryProps) {
  if (!packageConfig) {
    return (
      <Card className="border-border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No package configured yet.
          </p>
          <ButtonLink href={`/packages/builder?dealId=${dealId}`} variant="brand" size="sm">
            Configure package
          </ButtonLink>
        </CardContent>
      </Card>
    )
  }

  const land = demoLandLots.find((lot) => lot.id === packageConfig.landId)
  const design = demoHouseDesigns.find(
    (d) => d.id === packageConfig.designId
  )

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-surface-muted p-3 space-y-2">
          {land && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-phb-red" aria-hidden />
              <div>
                <p className="font-medium">{land.suburb}</p>
                <p className="text-text-secondary">{land.name}</p>
                <p className="text-text-tertiary">{formatCurrency(land.price)}</p>
              </div>
            </div>
          )}
          {design && (
            <div className="flex items-start gap-2 text-sm">
              <Home className="mt-0.5 size-4 shrink-0 text-phb-red" aria-hidden />
              <div>
                <p className="font-medium">{design.name}</p>
                <p className="text-text-secondary">
                  {design.bedrooms} bed · {design.bathrooms} bath · {design.cars} car
                </p>
                <p className="text-text-tertiary">{formatCurrency(design.price)}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Total package</span>
          <span className="text-lg font-semibold text-text-primary">
            {formatCurrency(packageConfig.total)}
          </span>
        </div>
        <ButtonLink href={`/packages/builder?dealId=${dealId}`} variant="outline" size="sm">
          Edit package
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
