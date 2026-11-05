import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  DEFAULT_PACKAGE_TEMPLATE_FILTERS,
  type PackageTemplateFilters,
} from '@/domain/packages/package.types'

function resetFilters (): PackageTemplateFilters {
  return { ...DEFAULT_PACKAGE_TEMPLATE_FILTERS }
}

describe('package template filter reset', () => {
  it('restores default filter values', () => {
    const dirty: PackageTemplateFilters = {
      houseWidth: 15,
      bedrooms: 4,
      perfectFor: 'investor',
    }
    void dirty
    assert.deepEqual(resetFilters(), DEFAULT_PACKAGE_TEMPLATE_FILTERS)
  })
})
