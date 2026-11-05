'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type {
  HouseDesign,
  PackageTemplate,
  PerfectForTag,
} from '@/domain/packages/package.types'
import { PERFECT_FOR_LABELS } from '@/domain/packages/perfect-for-labels'
import {
  demoHouseDesigns,
  demoLandLots,
  demoPackageExtras,
} from '@/data/demo/packages'
import { calculatePackageTotal } from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import {
  createCustomDesignId,
  createCustomTemplateId,
  getMergedHouseDesigns,
  usePackageWorkspace,
} from '@/components/packages/use-package-workspace'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface PackageTemplateFormProps {
  mode: 'create' | 'edit' | 'view'
  template?: PackageTemplate
  design?: HouseDesign
}

const SELECT_CLASS =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function PackageTemplateForm ({
  mode: initialMode,
  template: initialTemplate,
  design: initialDesign,
}: PackageTemplateFormProps) {
  const router = useRouter()
  const { upsertCustomTemplate, archiveCustomTemplate, state } =
    usePackageWorkspace()
  const readOnly = initialMode === 'view'

  const existingDesign =
    initialDesign ??
    (initialTemplate
      ? getMergedHouseDesigns(state).find(
          (item) => item.id === initialTemplate.designId
        )
      : undefined)

  const [name, setName] = useState(initialTemplate?.name ?? '')
  const [builder, setBuilder] = useState(existingDesign?.builder ?? 'Summit Homes')
  const [designName, setDesignName] = useState(
    existingDesign?.name ?? 'Custom design'
  )
  const [houseWidth, setHouseWidth] = useState(
    String(existingDesign?.houseWidth ?? 12)
  )
  const [bedrooms, setBedrooms] = useState(
    String(existingDesign?.bedrooms ?? 4)
  )
  const [bathrooms, setBathrooms] = useState(
    String(existingDesign?.bathrooms ?? 2)
  )
  const [cars, setCars] = useState(String(existingDesign?.cars ?? 2))
  const [buildPrice, setBuildPrice] = useState(
    String(existingDesign?.price ?? 300000)
  )
  const [summary, setSummary] = useState(existingDesign?.summary ?? '')
  const [perfectFor, setPerfectFor] = useState<PerfectForTag[]>(
    existingDesign?.perfectFor ?? ['first-home']
  )
  const [landId, setLandId] = useState(
    initialTemplate?.landId ?? demoLandLots[0].id
  )
  const [includedExtras, setIncludedExtras] = useState<string[]>(
    initialTemplate?.includedExtras ?? []
  )
  const [priceNotes, setPriceNotes] = useState(
    initialTemplate?.priceNotes ?? ''
  )
  const [error, setError] = useState<string | null>(null)

  const selectedLand = demoLandLots.find((lot) => lot.id === landId)
  const extras = demoPackageExtras.filter((extra) =>
    includedExtras.includes(extra.id)
  )
  const total = selectedLand
    ? calculatePackageTotal(
        selectedLand.price,
        Number(buildPrice) || 0,
        extras
      )
    : 0

  const catalogDesignOptions = useMemo(
    () => demoHouseDesigns,
    []
  )

  function toggleTag (tag: PerfectForTag) {
    if (readOnly) return
    setPerfectFor((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    )
  }

  function toggleExtra (extraId: string) {
    if (readOnly) return
    setIncludedExtras((current) =>
      current.includes(extraId)
        ? current.filter((id) => id !== extraId)
        : [...current, extraId]
    )
  }

  function loadCatalogDesign (designId: string) {
    const design = demoHouseDesigns.find((item) => item.id === designId)
    if (!design || readOnly) return
    setDesignName(design.name)
    setBuilder(design.builder)
    setHouseWidth(String(design.houseWidth))
    setBedrooms(String(design.bedrooms))
    setBathrooms(String(design.bathrooms))
    setCars(String(design.cars))
    setBuildPrice(String(design.price))
    setSummary(design.summary)
    setPerfectFor([...design.perfectFor])
  }

  function validate (): boolean {
    if (!name.trim()) {
      setError('Template name is required.')
      return false
    }
    const width = Number(houseWidth)
    const beds = Number(bedrooms)
    const baths = Number(bathrooms)
    const carCount = Number(cars)
    const price = Number(buildPrice)
    if (
      !Number.isFinite(width) ||
      !Number.isFinite(beds) ||
      !Number.isFinite(baths) ||
      !Number.isFinite(carCount) ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError('Enter valid numeric specs and a positive build price.')
      return false
    }
    if (!selectedLand) {
      setError('Select a land lot.')
      return false
    }
    setError(null)
    return true
  }

  function handleSave () {
    if (readOnly || !validate()) return

    const designId =
      initialMode === 'edit' && existingDesign
        ? existingDesign.id
        : createCustomDesignId()
    const templateId =
      initialMode === 'edit' &&
      initialTemplate &&
      initialTemplate.id !== 'pending-new'
        ? initialTemplate.id
        : createCustomTemplateId()

    const design: HouseDesign = {
      id: designId,
      name: designName.trim() || 'Custom design',
      builder: builder.trim() || 'Custom builder',
      price: Number(buildPrice),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      cars: Number(cars),
      houseWidth: Number(houseWidth),
      summary: summary.trim() || 'Custom house and land template.',
      perfectFor: perfectFor.length > 0 ? perfectFor : ['first-home'],
    }

    const template: PackageTemplate = {
      id: templateId,
      name: name.trim(),
      origin: 'custom',
      designId: design.id,
      landId,
      includedExtras: [...includedExtras],
      priceNotes: priceNotes.trim() || undefined,
    }

    upsertCustomTemplate(template, design)
    router.push('/packages')
  }

  function handleDuplicateAsCustom () {
    if (!initialTemplate || !existingDesign) return
    router.push(
      `/packages/templates/new?duplicateFrom=${initialTemplate.id}`
    )
  }

  function handleArchive () {
    if (!initialTemplate || initialTemplate.origin !== 'custom') return
    archiveCustomTemplate(initialTemplate.id)
    router.push('/packages')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/packages" className="hover:text-text-primary">
              Packages
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">
            {readOnly ? 'View template' : initialMode === 'edit' ? 'Edit template' : 'New template'}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {readOnly
              ? initialTemplate?.name
              : initialMode === 'edit'
                ? 'Edit custom template'
                : 'Create custom template'}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {readOnly
              ? 'Catalog templates are read-only. Duplicate to customize.'
              : 'Save a reusable house and land starting point for deals.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {readOnly ? (
            <>
              <Button type="button" variant="brand" onClick={handleDuplicateAsCustom}>
                Duplicate as custom
              </Button>
              <ButtonLink href="/packages" variant="outline" size="sm">
                Back
              </ButtonLink>
            </>
          ) : (
            <>
              <Button type="button" variant="brand" onClick={handleSave}>
                Save template
              </Button>
              <ButtonLink href="/packages" variant="outline" size="sm">
                Cancel
              </ButtonLink>
            </>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {!readOnly && initialMode === 'create' ? (
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Start from catalog design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className={SELECT_CLASS}
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) loadCatalogDesign(event.target.value)
              }}
            >
              <option value="">Optional — pick a catalog design</option>
              {catalogDesignOptions.map((design) => (
                <option key={design.id} value={design.id}>
                  {design.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Template details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="template-name" className="text-sm font-medium">
              Template name
            </label>
            <Input
              id="template-name"
              value={name}
              disabled={readOnly}
              onChange={(event) => setName(event.target.value)}
              placeholder="Randalls · Alkimos (investor)"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="design-name" className="text-sm font-medium">
                Design name
              </label>
              <Input
                id="design-name"
                value={designName}
                disabled={readOnly}
                onChange={(event) => setDesignName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="builder" className="text-sm font-medium">
                Builder
              </label>
              <Input
                id="builder"
                value={builder}
                disabled={readOnly}
                onChange={(event) => setBuilder(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { id: 'width', label: 'Width (m)', value: houseWidth, set: setHouseWidth },
              { id: 'beds', label: 'Bedrooms', value: bedrooms, set: setBedrooms },
              { id: 'baths', label: 'Bathrooms', value: bathrooms, set: setBathrooms },
              { id: 'cars', label: 'Cars', value: cars, set: setCars },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                </label>
                <Input
                  id={field.id}
                  type="number"
                  min="1"
                  value={field.value}
                  disabled={readOnly}
                  onChange={(event) => field.set(event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="build-price" className="text-sm font-medium">
              Build price
            </label>
            <Input
              id="build-price"
              type="number"
              min="1"
              step="1000"
              value={buildPrice}
              disabled={readOnly}
              onChange={(event) => setBuildPrice(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="text-sm font-medium">
              Summary
            </label>
            <Textarea
              id="summary"
              value={summary}
              disabled={readOnly}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Perfect for</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PERFECT_FOR_LABELS) as PerfectForTag[]).map(
                (tag) => {
                  const active = perfectFor.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={readOnly}
                      aria-pressed={active}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        active
                          ? 'border-phb-yellow bg-[#FFFCF0] text-text-primary'
                          : 'border-border text-text-secondary hover:bg-surface-muted'
                      )}
                    >
                      {PERFECT_FOR_LABELS[tag]}
                    </button>
                  )
                }
              )}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Land & upgrades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="land-lot" className="text-sm font-medium">
              Land lot
            </label>
            <select
              id="land-lot"
              className={SELECT_CLASS}
              value={landId}
              disabled={readOnly}
              onChange={(event) => setLandId(event.target.value)}
            >
              {demoLandLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.suburb} — {lot.name} ({formatCurrency(lot.price)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Included upgrades</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {demoPackageExtras.map((extra) => {
                const checked = includedExtras.includes(extra.id)
                return (
                  <button
                    key={extra.id}
                    type="button"
                    disabled={readOnly}
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
                    <span className="font-medium tabular-nums">
                      +{formatCurrency(extra.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="price-notes" className="text-sm font-medium">
              Price notes (optional)
            </label>
            <Input
              id="price-notes"
              value={priceNotes}
              disabled={readOnly}
              onChange={(event) => setPriceNotes(event.target.value)}
              placeholder="Promo pricing valid until June"
            />
          </div>

          <p className="text-sm text-text-secondary">
            Estimated template total:{' '}
            <span className="font-semibold text-text-primary">
              {formatCurrency(total)}
            </span>
          </p>
        </CardContent>
      </Card>

      {initialMode === 'edit' && initialTemplate?.origin === 'custom' ? (
        <div className="flex justify-end">
          <Button type="button" variant="destructive" onClick={handleArchive}>
            Archive template
          </Button>
        </div>
      ) : null}
    </div>
  )
}
