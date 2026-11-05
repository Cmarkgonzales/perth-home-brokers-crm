import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildDealPackageFromTemplate,
  filterPackageTemplates,
  isDealPackageCustomized,
  resolvePackageTemplates,
  suggestTemplatesForClient,
} from '@/domain/packages/package-template-utils'
import {
  demoCatalogTemplates,
  demoHouseDesigns,
  demoLandLots,
  demoPackageExtras,
} from '@/data/demo/packages'

const resolved = resolvePackageTemplates(
  demoCatalogTemplates,
  demoHouseDesigns,
  demoLandLots,
  demoPackageExtras
)

describe('filterPackageTemplates', () => {
  it('filters by house width', () => {
    const filtered = filterPackageTemplates(resolved, {
      houseWidth: 15,
      bedrooms: 'all',
      perfectFor: 'all',
    })
    assert.ok(filtered.every((item) => item.design.houseWidth === 15))
    assert.equal(filtered.length, 2)
  })

  it('filters by bedrooms and perfect for', () => {
    const filtered = filterPackageTemplates(resolved, {
      houseWidth: 'all',
      bedrooms: 4,
      perfectFor: 'first-home',
    })
    assert.ok(
      filtered.every(
        (item) =>
          item.design.bedrooms === 4 &&
          item.design.perfectFor.includes('first-home')
      )
    )
  })
})

describe('suggestTemplatesForClient', () => {
  it('ranks first-home templates for first home buyers', () => {
    const suggestions = suggestTemplatesForClient(resolved, {
      type: 'First Home Buyer',
      budget: 620000,
    })
    assert.ok(suggestions.length > 0)
    assert.ok(
      suggestions[0].template.design.perfectFor.includes('first-home') ||
        suggestions[0].budgetDelta >= 0
    )
  })
})

describe('buildDealPackageFromTemplate', () => {
  it('copies template fields onto a deal package', () => {
    const template = resolved.find(
      (item) => item.id === 'template-randalls-alkimos'
    )
    assert.ok(template)

    const config = buildDealPackageFromTemplate(
      'PHB-TEST',
      template,
      demoPackageExtras
    )
    assert.equal(config.dealId, 'PHB-TEST')
    assert.equal(config.templateId, template.id)
    assert.equal(config.landId, template.landId)
    assert.equal(config.designId, template.designId)
    assert.deepEqual(config.selectedExtras, template.includedExtras)
    assert.equal(config.customized, false)
  })
})

describe('isDealPackageCustomized', () => {
  it('detects when extras differ from template', () => {
    const template = demoCatalogTemplates.find(
      (item) => item.id === 'template-horizon-alkimos'
    )
    assert.ok(template)

    const config = buildDealPackageFromTemplate(
      'PHB-2026-00142',
      resolved.find((item) => item.id === 'template-horizon-alkimos')!,
      demoPackageExtras
    )
    const withStone = {
      ...config,
      selectedExtras: ['extra-stone'],
      extrasTotal: 8200,
      total: config.total + 8200,
    }

    assert.equal(
      isDealPackageCustomized(
        withStone,
        template,
        demoLandLots,
        demoHouseDesigns,
        demoPackageExtras
      ),
      true
    )
  })

  it('returns false when deal matches template snapshot', () => {
    const template = demoCatalogTemplates.find(
      (item) => item.id === 'template-madison-baldivis'
    )
    assert.ok(template)

    const dealTemplate = resolved.find(
      (item) => item.id === 'template-madison-baldivis'
    )
    assert.ok(dealTemplate)

    const config = buildDealPackageFromTemplate(
      'PHB-2026-00138',
      dealTemplate,
      demoPackageExtras
    )

    assert.equal(
      isDealPackageCustomized(
        config,
        template,
        demoLandLots,
        demoHouseDesigns,
        demoPackageExtras
      ),
      false
    )
  })
})
