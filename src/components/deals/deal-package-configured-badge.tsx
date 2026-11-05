'use client'

import { usePackageWorkspace } from '@/components/packages/use-package-workspace'
import { Badge } from '@/components/ui/badge'

export function DealPackageConfiguredBadge ({ dealId }: { dealId: string }) {
  const { getDealPackage } = usePackageWorkspace()
  const packageConfig = getDealPackage(dealId)

  if (packageConfig) return null

  return (
    <Badge variant="secondary" className="bg-warning/10 text-warning">
      Package not saved
    </Badge>
  )
}
