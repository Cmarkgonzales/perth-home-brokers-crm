import type {
  DealPackageConfig,
  HouseDesign,
  PackageTemplate,
} from '@/domain/packages/package.types'

export interface PackageWorkspaceState {
  customTemplates: PackageTemplate[]
  customDesigns: HouseDesign[]
  dealPackages: DealPackageConfig[]
}

export const EMPTY_PACKAGE_WORKSPACE: PackageWorkspaceState = {
  customTemplates: [],
  customDesigns: [],
  dealPackages: [],
}
