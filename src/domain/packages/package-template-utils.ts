import type { Client, ClientType } from '@/domain/clients/client.types'
import type {
  DealPackageConfig,
  HouseDesign,
  LandLot,
  PackageExtra,
  PackageTemplate,
  PackageTemplateFilters,
  PerfectForTag,
} from '@/domain/packages/package.types'

export interface ResolvedPackageTemplate extends PackageTemplate {
  design: HouseDesign
  land: LandLot
  total: number
}

export interface TemplateSuggestion {
  template: ResolvedPackageTemplate
  budgetDelta: number
  score: number
}

function extrasTotalForIds (
  extraIds: string[],
  extrasCatalog: PackageExtra[]
): number {
  return extraIds.reduce((sum, id) => {
    const extra = extrasCatalog.find((item) => item.id === id)
    return sum + (extra?.price ?? 0)
  }, 0)
}

export function resolvePackageTemplate (
  template: PackageTemplate,
  designs: HouseDesign[],
  landLots: LandLot[],
  extrasCatalog: PackageExtra[]
): ResolvedPackageTemplate | undefined {
  const design = designs.find((item) => item.id === template.designId)
  const land = landLots.find((item) => item.id === template.landId)
  if (!design || !land) return undefined

  const extrasTotal = extrasTotalForIds(template.includedExtras, extrasCatalog)
  return {
    ...template,
    design,
    land,
    total: land.price + design.price + extrasTotal,
  }
}

export function resolvePackageTemplates (
  templates: PackageTemplate[],
  designs: HouseDesign[],
  landLots: LandLot[],
  extrasCatalog: PackageExtra[]
): ResolvedPackageTemplate[] {
  return templates
    .filter((template) => !template.archived)
    .map((template) =>
      resolvePackageTemplate(template, designs, landLots, extrasCatalog)
    )
    .filter((item): item is ResolvedPackageTemplate => item !== undefined)
}

export function filterPackageTemplates (
  templates: ResolvedPackageTemplate[],
  filters: PackageTemplateFilters
): ResolvedPackageTemplate[] {
  return templates.filter((template) => {
    if (
      filters.houseWidth !== 'all' &&
      template.design.houseWidth !== filters.houseWidth
    ) {
      return false
    }
    if (
      filters.bedrooms !== 'all' &&
      template.design.bedrooms !== filters.bedrooms
    ) {
      return false
    }
    if (
      filters.perfectFor !== 'all' &&
      !template.design.perfectFor.includes(filters.perfectFor)
    ) {
      return false
    }
    return true
  })
}

export function clientTypeToPerfectForTags (
  clientType: ClientType
): PerfectForTag[] {
  switch (clientType) {
    case 'First Home Buyer':
      return ['first-home', 'growing-family']
    case 'Investor':
      return ['investor']
    case 'Home Buyer':
      return ['growing-family', 'downsizer']
    default:
      return []
  }
}

export function suggestTemplatesForClient (
  templates: ResolvedPackageTemplate[],
  client: Pick<Client, 'type' | 'budget'>
): TemplateSuggestion[] {
  const preferredTags = clientTypeToPerfectForTags(client.type)

  return templates
    .map((template) => {
      const tagMatches = template.design.perfectFor.filter((tag) =>
        preferredTags.includes(tag)
      ).length
      const budgetDelta = client.budget - template.total
      const withinBudget = budgetDelta >= 0 ? 1 : 0
      const score = tagMatches * 10 + withinBudget * 5 + budgetDelta / 100_000

      return { template, budgetDelta, score }
    })
    .sort((a, b) => b.score - a.score)
}

export function buildDealPackageFromTemplate (
  dealId: string,
  template: ResolvedPackageTemplate,
  extrasCatalog: PackageExtra[]
): DealPackageConfig {
  const extrasTotal = extrasTotalForIds(template.includedExtras, extrasCatalog)
  return {
    dealId,
    landId: template.landId,
    designId: template.designId,
    selectedExtras: [...template.includedExtras],
    landPrice: template.land.price,
    buildPrice: template.design.price,
    extrasTotal,
    total: template.total,
    templateId: template.id,
    customized: false,
  }
}

function sortedExtraIds (ids: string[]): string[] {
  return [...ids].sort()
}

export function isDealPackageCustomized (
  config: DealPackageConfig,
  template: PackageTemplate | undefined,
  landLots: LandLot[],
  designs: HouseDesign[],
  extrasCatalog: PackageExtra[]
): boolean {
  if (config.customized === true) return true
  if (!template) return false

  if (config.landId !== template.landId) return true
  if (config.designId !== template.designId) return true

  const configExtras = sortedExtraIds(config.selectedExtras)
  const templateExtras = sortedExtraIds(template.includedExtras)
  if (configExtras.join() !== templateExtras.join()) return true

  const land = landLots.find((lot) => lot.id === template.landId)
  const design = designs.find((item) => item.id === template.designId)
  if (!land || !design) return false

  const templateExtrasTotal = extrasTotalForIds(
    template.includedExtras,
    extrasCatalog
  )
  const templateTotal = land.price + design.price + templateExtrasTotal

  if (config.landPrice !== land.price) return true
  if (config.buildPrice !== design.price) return true
  if (config.extrasTotal !== templateExtrasTotal) return true
  if (config.total !== templateTotal) return true

  return false
}

export function withCustomizationFlag (
  config: DealPackageConfig,
  template: PackageTemplate | undefined,
  landLots: LandLot[],
  designs: HouseDesign[],
  extrasCatalog: PackageExtra[]
): DealPackageConfig {
  return {
    ...config,
    customized: isDealPackageCustomized(
      config,
      template,
      landLots,
      designs,
      extrasCatalog
    ),
  }
}

export function buildDealPackageFromSelection (
  dealId: string,
  land: LandLot,
  design: HouseDesign,
  selectedExtraIds: string[],
  extrasCatalog: PackageExtra[],
  templateId?: string
): DealPackageConfig {
  const activeExtras = extrasCatalog.filter((extra) =>
    selectedExtraIds.includes(extra.id)
  )
  const extrasTotal = activeExtras.reduce((sum, extra) => sum + extra.price, 0)
  const config: DealPackageConfig = {
    dealId,
    landId: land.id,
    designId: design.id,
    selectedExtras: [...selectedExtraIds],
    landPrice: land.price,
    buildPrice: design.price,
    extrasTotal,
    total: land.price + design.price + extrasTotal,
    templateId,
  }
  return config
}
