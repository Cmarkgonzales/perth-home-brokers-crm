import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildDashboardSnapshot,
  buildDonutSlices,
  classifyStalledSeverity,
  countDealsPastFinance,
  isUrgentDueLabel,
} from '@/domain/dashboard/dashboard-snapshot'
import type { Deal } from '@/domain/deals/deal.types'
import type { Lead } from '@/domain/leads/lead.types'
import { DEAL_STAGE_LABELS } from '@/lib/constants'

const baseBriefing = {
  headline: 'Test',
  overdueApprovals: 0,
  missingDocuments: 0,
  criticalCount: 0,
  prompt: 'test',
}

function makeDeal (overrides: Partial<Deal> & Pick<Deal, 'id' | 'stage'>): Deal {
  return {
    name: 'Test deal',
    clientId: 'client-001',
    value: 500_000,
    progress: 50,
    owner: 'James',
    nextAction: 'Follow up',
    nextActionDue: 'Tomorrow',
    ...overrides,
  }
}

describe('dashboard snapshot helpers', () => {
  it('classifies urgent due labels', () => {
    assert.equal(isUrgentDueLabel('Today'), true)
    assert.equal(isUrgentDueLabel('Overdue'), true)
    assert.equal(isUrgentDueLabel('3 days ago'), true)
    assert.equal(isUrgentDueLabel('Tomorrow'), false)
    assert.equal(classifyStalledSeverity('Overdue'), 'Urgent')
    assert.equal(classifyStalledSeverity('Friday'), 'High')
  })

  it('counts deals past finance on active book', () => {
    const deals: Deal[] = [
      makeDeal({ id: 'a', stage: 'finance' }),
      makeDeal({ id: 'b', stage: 'package' }),
      makeDeal({ id: 'c', stage: 'settlement' }),
    ]
    assert.equal(countDealsPastFinance(deals), 1)
  })

  it('merges qualified and finance into finance donut slice', () => {
    const deals: Deal[] = [
      makeDeal({ id: 'a', stage: 'lead' }),
      makeDeal({ id: 'b', stage: 'qualified' }),
      makeDeal({ id: 'c', stage: 'finance' }),
    ]
    const slices = buildDonutSlices(deals)
    const finance = slices.find((slice) => slice.id === 'finance')
    assert.equal(finance?.count, 2)
  })
})

describe('buildDashboardSnapshot', () => {
  it('builds money metrics and stalled severity from demo-shaped input', () => {
    const deals: Deal[] = [
      makeDeal({
        id: 'PHB-001',
        stage: 'settlement',
        value: 600_000,
      }),
      makeDeal({
        id: 'PHB-002',
        stage: 'finance',
        atRisk: true,
        nextActionDue: 'Overdue',
        nextAction: 'Bank statement missing',
      }),
      makeDeal({
        id: 'PHB-003',
        stage: 'package',
        atRisk: true,
        nextActionDue: 'Friday',
      }),
    ]

    const leads: Lead[] = [
      {
        id: 'lead-1',
        name: 'A',
        source: 'Web',
        budget: 600_000,
        status: 'New',
        owner: 'James',
      },
      {
        id: 'lead-2',
        name: 'B',
        source: 'Referral',
        budget: 500_000,
        status: 'Qualified',
        owner: 'James',
      },
    ]

    const snapshot = buildDashboardSnapshot({
      greetingName: 'Test',
      deals,
      leads,
      commissionSummary: {
        period: 'September 2026',
        pipeline: 10_000,
        expected: 20_000,
        paid: 5_000,
      },
      packageConfigs: [],
      designs: [],
      landLots: [],
      monthlySettlements: [{ month: 'Sep', count: 2 }],
      briefing: baseBriefing,
      stageLabels: DEAL_STAGE_LABELS,
    })

    assert.equal(snapshot.money[0]?.primaryValue, '1')
    assert.equal(snapshot.money[1]?.primaryValue, '$20k')
    assert.equal(snapshot.money[3]?.primaryValue, '2')
    assert.equal(snapshot.enquiries.length, 1)
    assert.equal(snapshot.stalledDeals[0]?.severity, 'Urgent')
    assert.equal(snapshot.book.pastFinancePercent, 50)
  })
})