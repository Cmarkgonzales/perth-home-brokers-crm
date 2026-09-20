import { demoDeals, getPackageConfigForDeal } from '@/data/demo'
import { formatCurrency } from '@/lib/formatting'
import { PageHeader } from '@/components/layout/page-header'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'

export default function PackagesPage () {
  const activeDeals = demoDeals.filter((deal) => deal.stage !== 'settlement')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Packages"
        description="Configure land and builder packages for active deals."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeDeals.map((deal) => {
          const pkg = getPackageConfigForDeal(deal.id)

          return (
            <Card key={deal.id} className="border-border shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  {deal.name}
                </CardTitle>
                <p className="font-mono text-xs text-text-tertiary">{deal.id}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <DealStageBadge stage={deal.stage} />
                {pkg ? (
                  <p className="text-sm text-text-secondary">
                    Package configured ·{' '}
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(pkg.total)}
                    </span>
                  </p>
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
    </div>
  )
}
