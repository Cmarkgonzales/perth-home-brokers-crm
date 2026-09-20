import type {
  DealPackageConfig,
  HouseDesign,
  LandLot,
  PackageExtra,
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
  },
  {
    id: 'design-madison',
    name: 'The Madison',
    builder: 'Summit Homes',
    price: 298000,
    bedrooms: 3,
    bathrooms: 2,
    cars: 2,
  },
  {
    id: 'design-aria',
    name: 'The Aria',
    builder: 'Plunkett Homes',
    price: 335000,
    bedrooms: 4,
    bathrooms: 2,
    cars: 2,
  },
]

export const demoPackageExtras: PackageExtra[] = [
  { id: 'extra-alfresco', name: 'Alfresco extension', price: 18500 },
  { id: 'extra-stone', name: 'Stone benchtops upgrade', price: 8200 },
  { id: 'extra-smart', name: 'Smart home package', price: 4500 },
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
