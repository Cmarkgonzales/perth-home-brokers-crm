'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import type { Deal } from '@/domain/deals/deal.types'
import type { DealPackageConfig } from '@/domain/packages/package.types'
import { getClientById } from '@/data/demo'
import {
  buildDealPackageFromSelection,
  buildDealPackageFromTemplate,
} from '@/domain/packages/package-template-utils'
import type { ResolvedPackageTemplate } from '@/domain/packages/package-template-utils'
import {
  calculatePackageTotal,
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
import { ChangeTemplateDialog } from '@/components/packages/change-template-dialog'
import { SaveAsTemplateDialog } from '@/components/packages/save-as-template-dialog'
import { usePackageWorkspace } from '@/components/packages/use-package-workspace'
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
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PackageBuilderProps {
  deal: Deal
  initialConfig?: DealPackageConfig
}

function packageBuilderStateKey (
  dealId: string,
  config?: DealPackageConfig
): string {
  if (!config) return `${dealId}-empty`
  return [
    dealId,
    config.landId,
    config.designId,
    config.selectedExtras.join(','),
    config.templateId ?? '',
  ].join(':')
}

function subscribeNoop () {
  return () => {}
}

export function PackageBuilder ({ deal, initialConfig }: PackageBuilderProps) {
  const { getDealPackage } = usePackageWorkspace()
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)

  if (!mounted) {
    return (
      <p className="text-sm text-text-secondary">Loading package builder…</p>
    )
  }

  const savedConfig = getDealPackage(deal.id) ?? initialConfig

  return (
    <PackageBuilderEditor
      key={packageBuilderStateKey(deal.id, savedConfig)}
      deal={deal}
      savedConfig={savedConfig}
    />
  )
}

interface PackageBuilderEditorProps {
  deal: Deal
  savedConfig?: DealPackageConfig
}

function PackageBuilderEditor ({
  deal,
  savedConfig,
}: PackageBuilderEditorProps) {
  const {
    houseDesigns,
    saveDealPackage,
    getTemplate,
  } = usePackageWorkspace()

  const [selectedLandId, setSelectedLandId] = useState(
    () => savedConfig?.landId ?? demoLandLots[0].id
  )
  const [selectedDesignId, setSelectedDesignId] = useState(
    () => savedConfig?.designId ?? houseDesigns[0]?.id ?? ''
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    () => savedConfig?.selectedExtras ?? []
  )
  const [templateId, setTemplateId] = useState<string | undefined>(
    () => savedConfig?.templateId
  )
  const [savedDialogOpen, setSavedDialogOpen] = useState(false)
  const [presentDialogOpen, setPresentDialogOpen] = useState(false)
  const [changeTemplateOpen, setChangeTemplateOpen] = useState(false)
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false)

  const selectedLand =
    demoLandLots.find((lot) => lot.id === selectedLandId) ?? demoLandLots[0]
  const selectedDesign =
    houseDesigns.find((design) => design.id === selectedDesignId) ??
    houseDesigns[0]

  const BUILDERS = useMemo(
    () => [...new Set(houseDesigns.map((design) => design.builder))],
    [houseDesigns]
  )

  const selectedBuilder = selectedDesign?.builder ?? BUILDERS[0] ?? ''
  const visibleDesigns = houseDesigns.filter(
    (design) => design.builder === selectedBuilder
  )

  const activeExtras = demoPackageExtras.filter((extra) =>
    selectedExtras.includes(extra.id)
  )
  const extrasTotal = activeExtras.reduce((sum, extra) => sum + extra.price, 0)
  const total = calculatePackageTotal(
    selectedLand.price,
    selectedDesign?.price ?? 0,
    activeExtras
  )
  const repayment = estimateRepayment(total)
  const client = getClientById(deal.clientId)
  const activeTemplate = templateId ? getTemplate(templateId) : undefined

  function selectBuilder (builder: string) {
    if (selectedBuilder === builder) return
    const nextDesign = houseDesigns.find((design) => design.builder === builder)
    if (nextDesign) setSelectedDesignId(nextDesign.id)
  }

  function toggleExtra (extraId: string) {
    setSelectedExtras((current) =>
      current.includes(extraId)
        ? current.filter((id) => id !== extraId)
        : [...current, extraId]
    )
  }

  function applyTemplate (template: ResolvedPackageTemplate) {
    const config = buildDealPackageFromTemplate(
      deal.id,
      template,
      demoPackageExtras
    )
    setSelectedLandId(config.landId)
    setSelectedDesignId(config.designId)
    setSelectedExtras(config.selectedExtras)
    setTemplateId(config.templateId)
  }

  function handleSave () {
    if (!selectedDesign) return
    const config = buildDealPackageFromSelection(
      deal.id,
      selectedLand,
      selectedDesign,
      selectedExtras,
      demoPackageExtras,
      templateId
    )
    saveDealPackage(config)
    setSavedDialogOpen(true)
  }

  if (!selectedDesign) {
    return (
      <p className="text-sm text-text-secondary">
        No house designs available. Add a custom template first.
      </p>
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

      <Card className="border-border shadow-none">
        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Starting template
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-text-primary">
                {activeTemplate?.name ?? 'No template selected'}
              </p>
              {activeTemplate ? (
                <Badge variant="outline" className="capitalize">
                  {activeTemplate.origin}
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setChangeTemplateOpen(true)}
            >
              Change template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSaveTemplateOpen(true)}
            >
              Save as template
            </Button>
          </div>
        </CardContent>
      </Card>

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
            onSave={handleSave}
            onPresent={() => setPresentDialogOpen(true)}
          />
        </aside>
      </div>

      <ChangeTemplateDialog
        open={changeTemplateOpen}
        onOpenChange={setChangeTemplateOpen}
        onSelect={applyTemplate}
      />

      <SaveAsTemplateDialog
        open={saveTemplateOpen}
        onOpenChange={setSaveTemplateOpen}
        landId={selectedLandId}
        designId={selectedDesignId}
        selectedExtras={selectedExtras}
      />

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
