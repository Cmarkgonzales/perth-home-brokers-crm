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
  imageUrl?: string
}

export interface PackageExtra {
  id: string
  name: string
  price: number
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
}
