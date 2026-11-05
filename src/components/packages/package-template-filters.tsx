'use client'

import type {
  PackageTemplateFilters,
  PerfectForTag,
} from '@/domain/packages/package.types'
import { DEFAULT_PACKAGE_TEMPLATE_FILTERS } from '@/domain/packages/package.types'
import { PERFECT_FOR_LABELS } from '@/domain/packages/perfect-for-labels'
import { Button } from '@/components/ui/button'

interface PackageTemplateFiltersBarProps {
  filters: PackageTemplateFilters
  houseWidthOptions: number[]
  bedroomOptions: number[]
  onChange: (filters: PackageTemplateFilters) => void
}

const SELECT_CLASS =
  'h-8 w-full min-w-[8rem] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function PackageTemplateFiltersBar ({
  filters,
  houseWidthOptions,
  bedroomOptions,
  onChange,
}: PackageTemplateFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="space-y-1">
        <label htmlFor="filter-width" className="text-xs font-medium text-text-secondary">
          House width
        </label>
        <select
          id="filter-width"
          className={SELECT_CLASS}
          value={filters.houseWidth === 'all' ? 'all' : String(filters.houseWidth)}
          onChange={(event) => {
            const value = event.target.value
            onChange({
              ...filters,
              houseWidth: value === 'all' ? 'all' : Number(value),
            })
          }}
        >
          <option value="all">All widths</option>
          {houseWidthOptions.map((width) => (
            <option key={width} value={width}>
              {width}m
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="filter-beds" className="text-xs font-medium text-text-secondary">
          Bedrooms
        </label>
        <select
          id="filter-beds"
          className={SELECT_CLASS}
          value={filters.bedrooms === 'all' ? 'all' : String(filters.bedrooms)}
          onChange={(event) => {
            const value = event.target.value
            onChange({
              ...filters,
              bedrooms: value === 'all' ? 'all' : Number(value),
            })
          }}
        >
          <option value="all">All bedrooms</option>
          {bedroomOptions.map((beds) => (
            <option key={beds} value={beds}>
              {beds} bed
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="filter-perfect" className="text-xs font-medium text-text-secondary">
          Perfect for
        </label>
        <select
          id="filter-perfect"
          className={SELECT_CLASS}
          value={filters.perfectFor}
          onChange={(event) => {
            onChange({
              ...filters,
              perfectFor: event.target.value as PackageTemplateFilters['perfectFor'],
            })
          }}
        >
          <option value="all">All buyers</option>
          {(Object.keys(PERFECT_FOR_LABELS) as PerfectForTag[]).map((tag) => (
            <option key={tag} value={tag}>
              {PERFECT_FOR_LABELS[tag]}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="button"
        variant="brand"
        size="sm"
        className="sm:mb-0.5"
        onClick={() => onChange({ ...DEFAULT_PACKAGE_TEMPLATE_FILTERS })}
      >
        Reset
      </Button>
    </div>
  )
}
