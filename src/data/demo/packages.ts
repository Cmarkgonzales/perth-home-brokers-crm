import type {
  DealPackageConfig,
  HouseDesign,
  LandLot,
  PackageExtra,
  PackageTemplate,
} from '@/domain/packages/package.types'

export const demoLandLots: LandLot[] = [
  {
    id: 'land-alkimos',
    name: 'Lot 42 — Coastal Drive',
    suburb: 'Alkimos',
    price: 250000,
    size: '375m²',
  },
  {
    id: 'land-baldivis',
    name: 'Lot 18 — Parkside Estate',
    suburb: 'Baldivis',
    price: 265000,
    size: '420m²',
  },
  {
    id: 'land-byford',
    name: 'Lot 7 — Heritage Grove',
    suburb: 'Byford',
    price: 235000,
    size: '350m²',
  },
]

export const demoHouseDesigns: HouseDesign[] = [
  {
    id: 'design-horizon',
    name: 'The Horizon',
    builder: 'Summit Homes',
    price: 320000,
    bedrooms: 4,
    bathrooms: 2,
    cars: 2,
    houseWidth: 12,
    summary: 'Open-plan family layout with alfresco-ready living.',
    perfectFor: ['growing-family', 'first-home'],
  },
  {
    id: 'design-madison',
    name: 'The Madison',
    builder: 'Summit Homes',
    price: 298000,
    bedrooms: 3,
    bathrooms: 2,
    cars: 2,
    houseWidth: 10,
    summary: 'Compact three-bedroom design suited to narrower lots.',
    perfectFor: ['first-home', 'downsizer'],
  },
  {
    id: 'design-aria',
    name: 'The Aria',
    builder: 'Plunkett Homes',
    price: 335000,
    bedrooms: 4,
    bathrooms: 2,
    cars: 2,
    houseWidth: 14,
    summary: 'Four-bedroom executive layout with separate theatre space.',
    perfectFor: ['growing-family', 'investor'],
  },
  {
    id: 'design-randalls',
    name: 'Randalls',
    builder: 'Summit Homes',
    price: 342000,
    bedrooms: 4,
    bathrooms: 2,
    cars: 2,
    houseWidth: 15,
    summary: '15m frontage with games room and open living.',
    perfectFor: ['growing-family', 'first-home'],
  },
  {
    id: 'design-paulsens',
    name: 'Paulsens',
    builder: 'Plunkett Homes',
    price: 305000,
    bedrooms: 4,
    bathrooms: 2,
    cars: 2,
    houseWidth: 12,
    summary: '12m design with flexible fourth bedroom or study.',
    perfectFor: ['first-home', 'investor'],
  },
  {
    id: 'design-norseman',
    name: 'Norseman',
    builder: 'Summit Homes',
    price: 358000,
    bedrooms: 4,
    bathrooms: 2,
    cars: 2,
    houseWidth: 15,
    summary: '15m family home with master suite and rear activity zone.',
    perfectFor: ['growing-family', 'investor'],
  },
]

export const demoPackageExtras: PackageExtra[] = [
  { id: 'extra-alfresco', name: 'Alfresco extension', price: 18500 },
  { id: 'extra-stone', name: 'Stone benchtops upgrade', price: 8200 },
  { id: 'extra-smart', name: 'Smart home package', price: 4500 },
]

export const demoCatalogTemplates: PackageTemplate[] = [
  {
    id: 'template-horizon-alkimos',
    name: 'Horizon · Alkimos',
    origin: 'catalog',
    designId: 'design-horizon',
    landId: 'land-alkimos',
    includedExtras: [],
  },
  {
    id: 'template-madison-baldivis',
    name: 'Madison · Baldivis',
    origin: 'catalog',
    designId: 'design-madison',
    landId: 'land-baldivis',
    includedExtras: [],
  },
  {
    id: 'template-randalls-alkimos',
    name: 'Randalls · Alkimos',
    origin: 'catalog',
    designId: 'design-randalls',
    landId: 'land-alkimos',
    includedExtras: ['extra-stone'],
  },
  {
    id: 'template-paulsens-byford',
    name: 'Paulsens · Byford',
    origin: 'catalog',
    designId: 'design-paulsens',
    landId: 'land-byford',
    includedExtras: [],
  },
  {
    id: 'template-norseman-baldivis',
    name: 'Norseman · Baldivis',
    origin: 'catalog',
    designId: 'design-norseman',
    landId: 'land-baldivis',
    includedExtras: ['extra-alfresco'],
  },
  {
    id: 'template-aria-byford',
    name: 'Aria · Byford',
    origin: 'catalog',
    designId: 'design-aria',
    landId: 'land-byford',
    includedExtras: [],
  },
]

export const demoPackageConfigs: DealPackageConfig[] = [
  {
    dealId: 'PHB-2026-00142',
    landId: 'land-alkimos',
    designId: 'design-horizon',
    selectedExtras: ['extra-stone'],
    landPrice: 250000,
    buildPrice: 320000,
    extrasTotal: 8200,
    total: 578200,
    templateId: 'template-horizon-alkimos',
    customized: true,
  },
  {
    dealId: 'PHB-2026-00138',
    landId: 'land-baldivis',
    designId: 'design-madison',
    selectedExtras: [],
    landPrice: 265000,
    buildPrice: 298000,
    extrasTotal: 0,
    total: 563000,
    templateId: 'template-madison-baldivis',
    customized: false,
  },
]

export function calculatePackageTotal (
  landPrice: number,
  buildPrice: number,
  extras: PackageExtra[]
): number {
  const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0)
  return landPrice + buildPrice + extrasTotal
}

export function estimateRepayment (total: number): number {
  // Demo estimate only — 6.2% over 30 years
  const rate = 0.062 / 12
  const months = 30 * 12
  const loan = total * 0.9
  return Math.round(
    (loan * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1)
  )
}

export function getCatalogTemplateById (id: string): PackageTemplate | undefined {
  return demoCatalogTemplates.find((template) => template.id === id)
}
