'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Deal } from '@/domain/deals/deal.types'
import type { DealPackageConfig } from '@/domain/packages/package.types'
import { getClientById } from '@/data/demo'
import {
  calculatePackageTotal,
  demoHouseDesigns,
  demoLandLots,
  demoPackageExtras,
  estimateRepayment,
} from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import { LandCard } from '@/components/packages/land-card'
import {
  BuilderPicker,
  BuilderSelector,
} from '@/components/packages/builder-selector'
import { PackageSummaryPanel } from '@/components/packages/package-summary-panel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const BUILDERS = [...new Set(demoHouseDesigns.map((design) => design.builder))]

interface PackageBuilderProps {
  deal: Deal
  initialConfig?: DealPackageConfig
}

export function PackageBuilder ({ deal, initialConfig }: PackageBuilderProps) {
  const [selectedLandId, setSelectedLandId] = useState(
    initialConfig?.landId ?? demoLandLots[0].id
  )
  const [selectedDesignId, setSelectedDesignId] = useState(
    initialConfig?.designId ?? demoHouseDesigns[0].id
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    initialConfig?.selectedExtras ?? []
  )
  const [savedDialogOpen, setSavedDialogOpen] = useState(false)
  const [presentDialogOpen, setPresentDialogOpen] = useState(false)

  const selectedLand = demoLandLots.find((lot) => lot.id === selectedLandId)!
  const selectedDesign = demoHouseDesigns.find(
    (design) => design.id === selectedDesignId
  )!
  const selectedBuilder = selectedDesign.builder
  const visibleDesigns = demoHouseDesigns.filter(
    (design) => design.builder === selectedBuilder
  )
  const activeExtras = demoPackageExtras.filter((extra) =>
    selectedExtras.includes(extra.id)
  )
  const extrasTotal = activeExtras.reduce((sum, extra) => sum + extra.price, 0)
  const total = calculatePackageTotal(
    selectedLand.price,
    selectedDesign.price,
    activeExtras
  )
  const repayment = estimateRepayment(total)
  const client = getClientById(deal.clientId)

  function selectBuilder (builder: string) {
    if (selectedBuilder === builder) {
      return
    }

    const nextDesign = demoHouseDesigns.find(
      (design) => design.builder === builder
    )

    if (nextDesign) {
      setSelectedDesignId(nextDesign.id)
    }
  }

  function toggleExtra (extraId: string) {
    setSelectedExtras((current) =>
      current.includes(extraId)
        ? current.filter((id) => id !== extraId)
        : [...current, extraId]
    )
  }

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/packages" className="hover:text-text-primary">
              Packages
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">{deal.name}</li>
        </ol>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[32px]">
          Package Builder
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {deal.name} · {deal.id}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem] xl:grid-cols-[minmax(0,1fr)_22.5rem]">
        <div className="space-y-5">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Land</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {demoLandLots.map((lot) => (
                  <LandCard
                    key={lot.id}
                    lot={lot}
                    selected={lot.id === selectedLandId}
                    onSelect={setSelectedLandId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <BuilderPicker
                builders={BUILDERS}
                selectedBuilder={selectedBuilder}
                onSelect={selectBuilder}
              />
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Home design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BuilderSelector
                designs={visibleDesigns}
                selectedId={selectedDesignId}
                onSelect={setSelectedDesignId}
              />
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Upgrades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {demoPackageExtras.map((extra) => {
                  const checked = selectedExtras.includes(extra.id)

                  return (
                    <button
                      key={extra.id}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleExtra(extra.id)}
                      className={cn(
                        'flex items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                        checked
                          ? 'border-phb-yellow bg-[#FFFCF0]'
                          : 'border-border hover:bg-surface-muted'
                      )}
                    >
                      <span>{extra.name}</span>
                      <span className="font-medium tabular-nums text-text-primary">
                        +{formatCurrency(extra.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="order-first lg:sticky lg:top-8 lg:order-none">
          <PackageSummaryPanel
            dealId={deal.id}
            dealName={deal.name}
            land={selectedLand}
            design={selectedDesign}
            extrasTotal={extrasTotal}
            total={total}
            monthlyRepayment={repayment}
            budget={client?.budget}
            onSave={() => setSavedDialogOpen(true)}
            onPresent={() => setPresentDialogOpen(true)}
          />
        </aside>
      </div>

      <Dialog open={savedDialogOpen} onOpenChange={setSavedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Package saved</DialogTitle>
            <DialogDescription>
              {selectedLand.suburb} + {selectedDesign.name} configuration saved
              for {deal.name} at {formatCurrency(total)}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSavedDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={presentDialogOpen} onOpenChange={setPresentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Present to client</DialogTitle>
            <DialogDescription>
              A presentation link would be sent to the client. This is a demo
              confirmation only — no email is sent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="brand" onClick={() => setPresentDialogOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
