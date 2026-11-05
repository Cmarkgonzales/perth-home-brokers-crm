export type PerfectForTag =
  | 'first-home'
  | 'growing-family'
  | 'investor'
  | 'downsizer'

export type PackageTemplateOrigin = 'catalog' | 'custom'

export interface LandLot {
  id: string
  name: string
  suburb: string
  price: number
  size: string
  imageUrl?: string
}

export interface HouseDesign {
  id: string
  name: string
  builder: string
  price: number
  bedrooms: number
  bathrooms: number
  cars: number
  houseWidth: number
  summary: string
  perfectFor: PerfectForTag[]
  imageUrl?: string
}

export interface PackageExtra {
  id: string
  name: string
  price: number
}

export interface PackageTemplate {
  id: string
  name: string
  origin: PackageTemplateOrigin
  designId: string
  landId: string
  includedExtras: string[]
  priceNotes?: string
  archived?: boolean
}

export interface DealPackageConfig {
  dealId: string
  landId: string
  designId: string
  selectedExtras: string[]
  landPrice: number
  buildPrice: number
  extrasTotal: number
  total: number
  templateId?: string
  customized?: boolean
}

export interface PackageTemplateFilters {
  houseWidth: number | 'all'
  bedrooms: number | 'all'
  perfectFor: PerfectForTag | 'all'
}

export const DEFAULT_PACKAGE_TEMPLATE_FILTERS: PackageTemplateFilters = {
  houseWidth: 'all',
  bedrooms: 'all',
  perfectFor: 'all',
}
