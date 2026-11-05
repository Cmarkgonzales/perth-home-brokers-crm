'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type {
  DealPackageConfig,
  HouseDesign,
  PackageTemplate,
} from '@/domain/packages/package.types'
import type { PackageWorkspaceState } from '@/domain/packages/package-store.types'
import { EMPTY_PACKAGE_WORKSPACE } from '@/domain/packages/package-store.types'
import {
  withCustomizationFlag,
} from '@/domain/packages/package-template-utils'
import {
  demoCatalogTemplates,
  demoHouseDesigns,
  demoLandLots,
  demoPackageConfigs,
  demoPackageExtras,
  getCatalogTemplateById,
} from '@/data/demo/packages'

const STORAGE_KEY = 'phb-package-workspace'
const CHANGE_EVENT = 'phb-package-workspace-changed'

function isDealPackageConfig (value: unknown): value is DealPackageConfig {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.dealId === 'string' &&
    typeof record.landId === 'string' &&
    typeof record.designId === 'string' &&
    Array.isArray(record.selectedExtras) &&
    typeof record.landPrice === 'number' &&
    typeof record.buildPrice === 'number' &&
    typeof record.extrasTotal === 'number' &&
    typeof record.total === 'number'
  )
}

function isPackageTemplate (value: unknown): value is PackageTemplate {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    (record.origin === 'catalog' || record.origin === 'custom') &&
    typeof record.designId === 'string' &&
    typeof record.landId === 'string' &&
    Array.isArray(record.includedExtras)
  )
}

function isHouseDesign (value: unknown): value is HouseDesign {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.builder === 'string' &&
    typeof record.price === 'number' &&
    typeof record.bedrooms === 'number' &&
    typeof record.bathrooms === 'number' &&
    typeof record.cars === 'number' &&
    typeof record.houseWidth === 'number' &&
    typeof record.summary === 'string' &&
    Array.isArray(record.perfectFor)
  )
}

function isWorkspaceState (value: unknown): value is PackageWorkspaceState {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  if (!Array.isArray(record.customTemplates)) return false
  if (!Array.isArray(record.dealPackages)) return false
  const customDesigns = record.customDesigns
  if (customDesigns !== undefined && !Array.isArray(customDesigns)) {
    return false
  }
  return (
    record.customTemplates.every(isPackageTemplate) &&
    record.dealPackages.every(isDealPackageConfig) &&
    (customDesigns === undefined || customDesigns.every(isHouseDesign))
  )
}

function normalizeWorkspace (state: PackageWorkspaceState): PackageWorkspaceState {
  return {
    customTemplates: state.customTemplates,
    customDesigns: state.customDesigns ?? [],
    dealPackages: state.dealPackages,
  }
}

function parseWorkspace (raw: string | null): PackageWorkspaceState {
  if (!raw) return EMPTY_PACKAGE_WORKSPACE
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isWorkspaceState(parsed)) return EMPTY_PACKAGE_WORKSPACE
    return normalizeWorkspace(parsed)
  } catch {
    return EMPTY_PACKAGE_WORKSPACE
  }
}

let cachedRaw: string | null | undefined
let cachedState: PackageWorkspaceState = EMPTY_PACKAGE_WORKSPACE

function getWorkspaceSnapshot (): PackageWorkspaceState {
  if (typeof window === 'undefined') return EMPTY_PACKAGE_WORKSPACE
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedState
  cachedRaw = raw
  cachedState = parseWorkspace(raw)
  return cachedState
}

function subscribeToWorkspace (onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
  }
}

function persistWorkspace (state: PackageWorkspaceState) {
  const raw = JSON.stringify(state)
  localStorage.setItem(STORAGE_KEY, raw)
  cachedRaw = raw
  cachedState = state
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function findTemplateById (
  id: string,
  state: PackageWorkspaceState
): PackageTemplate | undefined {
  return (
    state.customTemplates.find((template) => template.id === id) ??
    getCatalogTemplateById(id)
  )
}

function allTemplates (state: PackageWorkspaceState): PackageTemplate[] {
  const customIds = new Set(state.customTemplates.map((template) => template.id))
  const catalog = demoCatalogTemplates.filter(
    (template) => !customIds.has(template.id)
  )
  return [...catalog, ...state.customTemplates.filter((t) => !t.archived)]
}

export function getMergedHouseDesigns (
  workspace?: PackageWorkspaceState
): HouseDesign[] {
  const state = workspace ?? getWorkspaceSnapshot()
  const byId = new Map<string, HouseDesign>()
  for (const design of demoHouseDesigns) {
    byId.set(design.id, design)
  }
  for (const design of state.customDesigns) {
    byId.set(design.id, design)
  }
  return [...byId.values()]
}

export function getMergedDealPackageConfig (
  dealId: string,
  workspace?: PackageWorkspaceState
): DealPackageConfig | undefined {
  const state = workspace ?? getWorkspaceSnapshot()
  const fromStore = state.dealPackages.find((pkg) => pkg.dealId === dealId)
  if (fromStore) return fromStore
  return demoPackageConfigs.find((pkg) => pkg.dealId === dealId)
}

export function usePackageWorkspace () {
  const state = useSyncExternalStore(
    subscribeToWorkspace,
    getWorkspaceSnapshot,
    (): PackageWorkspaceState => EMPTY_PACKAGE_WORKSPACE
  )

  const templates = allTemplates(state)

  const getDealPackage = useCallback(
    (dealId: string) => getMergedDealPackageConfig(dealId, state),
    [state]
  )

  const saveDealPackage = useCallback((config: DealPackageConfig) => {
    const current = getWorkspaceSnapshot()
    const template = config.templateId
      ? findTemplateById(config.templateId, current)
      : undefined
    const withFlag = withCustomizationFlag(
      config,
      template,
      demoLandLots,
      demoHouseDesigns,
      demoPackageExtras
    )
    const nextPackages = [
      ...current.dealPackages.filter((pkg) => pkg.dealId !== config.dealId),
      withFlag,
    ]
    persistWorkspace({ ...current, dealPackages: nextPackages })
  }, [])

  const upsertCustomTemplate = useCallback(
    (template: PackageTemplate, design?: HouseDesign) => {
      const current = normalizeWorkspace(getWorkspaceSnapshot())
      const exists = current.customTemplates.some(
        (item) => item.id === template.id
      )
      const customTemplates = exists
        ? current.customTemplates.map((item) =>
            item.id === template.id ? template : item
          )
        : [...current.customTemplates, template]

      let customDesigns = current.customDesigns
      if (design) {
        const designExists = customDesigns.some(
          (item) => item.id === design.id
        )
        customDesigns = designExists
          ? customDesigns.map((item) =>
              item.id === design.id ? design : item
            )
          : [...customDesigns, design]
      }

      persistWorkspace({ ...current, customTemplates, customDesigns })
    },
    []
  )

  const archiveCustomTemplate = useCallback((templateId: string) => {
    const current = getWorkspaceSnapshot()
    persistWorkspace({
      ...current,
      customTemplates: current.customTemplates.map((template) =>
        template.id === templateId
          ? { ...template, archived: true }
          : template
      ),
    })
  }, [])

  const getTemplate = useCallback(
    (templateId: string) => findTemplateById(templateId, state),
    [state]
  )

  const houseDesigns = getMergedHouseDesigns(state)

  return {
    state,
    templates,
    houseDesigns,
    getDealPackage,
    saveDealPackage,
    upsertCustomTemplate,
    archiveCustomTemplate,
    getTemplate,
  }
}

export function createCustomDesignId (): string {
  return `design-custom-${crypto.randomUUID()}`
}

export function createCustomTemplateId (): string {
  return `template-custom-${crypto.randomUUID()}`
}

export function buildCustomTemplateFromDesign (
  design: HouseDesign,
  landId: string,
  includedExtras: string[],
  name: string
): PackageTemplate {
  return {
    id: createCustomTemplateId(),
    name,
    origin: 'custom',
    designId: design.id,
    landId,
    includedExtras,
  }
}
