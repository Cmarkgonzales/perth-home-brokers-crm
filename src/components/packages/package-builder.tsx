'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Deal } from '@/domain/deals/deal.types'
import type { DealPackageConfig } from '@/domain/packages/package.types'
import {
  calculatePackageTotal,
  demoHouseDesigns,
  demoLandLots,
  demoPackageExtras,
  estimateRepayment,
} from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import { LandCard } from '@/components/packages/land-card'
import { BuilderSelector } from '@/components/packages/builder-selector'
import { Button, ButtonLink } from '@/components/ui/button'
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
  const activeExtras = demoPackageExtras.filter((extra) =>
    selectedExtras.includes(extra.id)
  )
  const total = calculatePackageTotal(
    selectedLand.price,
    selectedDesign.price,
    activeExtras
  )
  const repayment = estimateRepayment(total)

  function toggleExtra (extraId: string) {
    setSelectedExtras((current) =>
      current.includes(extraId)
        ? current.filter((id) => id !== extraId)
        : [...current, extraId]
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/packages"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to packages
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[32px]">
          Package Builder
        </h1>
        <p className="text-sm text-text-secondary">
          {deal.name} · {deal.id}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Land</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          House design
        </h2>
        <BuilderSelector
          designs={demoHouseDesigns}
          selectedId={selectedDesignId}
          onSelect={setSelectedDesignId}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Upgrades</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {demoPackageExtras.map((extra) => {
            const checked = selectedExtras.includes(extra.id)

            return (
              <button
                key={extra.id}
                type="button"
                onClick={() => toggleExtra(extra.id)}
                className={cn(
                  'flex flex-col gap-1 rounded-lg border p-3 text-left text-sm transition-colors sm:flex-row sm:items-center sm:justify-between',
                  checked
                    ? 'border-phb-yellow bg-[#FFFCF0]'
                    : 'border-border hover:bg-surface-muted'
                )}
              >
                <span>{extra.name}</span>
                <span className="font-medium tabular-nums">
                  +{formatCurrency(extra.price)}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Package summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">
              Land — {selectedLand.suburb}
            </span>
            <span>{formatCurrency(selectedLand.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">
              Build — {selectedDesign.name}
            </span>
            <span>{formatCurrency(selectedDesign.price)}</span>
          </div>
          {activeExtras.map((extra) => (
            <div key={extra.id} className="flex justify-between">
              <span className="text-text-secondary">{extra.name}</span>
              <span>{formatCurrency(extra.price)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              Demo repayment estimate: {formatCurrency(repayment)}/month
              (90% LVR, 6.2% over 30 years — illustrative only)
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="brand" onClick={() => setSavedDialogOpen(true)}>
              Save package
            </Button>
            <Button variant="outline" onClick={() => setPresentDialogOpen(true)}>
              Present to client
            </Button>
            <ButtonLink href={`/deals/${deal.id}`} variant="outline">
              Back to deal
            </ButtonLink>
          </div>
        </CardContent>
      </Card>

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
