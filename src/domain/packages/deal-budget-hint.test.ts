import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatDealBudgetHint } from '@/domain/packages/deal-budget-hint'

describe('formatDealBudgetHint', () => {
  it('describes under-budget deals', () => {
    assert.match(formatDealBudgetHint(650_000, 578_200), /under budget/)
  })

  it('describes over-budget deals', () => {
    assert.match(formatDealBudgetHint(500_000, 578_200), /over budget/)
  })
})
