import type {
  Commission,
  CommissionSummary,
} from '@/domain/commissions/commission.types'

const COMMISSION_RATE = 0.025
const CONSULTANT_SPLIT = 0.7

function buildCommission (
  id: string,
  dealId: string,
  dealName: string,
  consultant: string,
  dealValue: number,
  status: Commission['status']
): Commission {
  const grossCommission = Math.round(dealValue * COMMISSION_RATE)
  const consultantAmount = Math.round(grossCommission * CONSULTANT_SPLIT)
  const officeAmount = grossCommission - consultantAmount

  return {
    id,
    dealId,
    dealName,
    consultant,
    dealValue,
    commissionRate: COMMISSION_RATE,
    grossCommission,
    consultantAmount,
    officeAmount,
    status,
    period: 'September 2026',
  }
}

export const demoCommissions: Commission[] = [
  buildCommission(
    'comm-001',
    'PHB-2026-00142',
    'Williams Family Home',
    'James',
    642000,
    'expected'
  ),
  buildCommission(
    'comm-002',
    'PHB-2026-00138',
    'Chen Residence',
    'Arvin',
    518000,
    'expected'
  ),
  buildCommission(
    'comm-003',
    'PHB-2026-00151',
    'Smith Investment Property',
    'Jay',
    465000,
    'pipeline'
  ),
  buildCommission(
    'comm-004',
    'PHB-2026-00140',
    'Wilson Construction',
    'Sarah',
    710000,
    'pipeline'
  ),
  buildCommission(
    'comm-005',
    'PHB-2026-00120',
    'Nguyen Settlement',
    'James',
    612000,
    'paid'
  ),
  buildCommission(
    'comm-006',
    'PHB-2026-00133',
    'Patel Family Build',
    'James',
    595000,
    'pipeline'
  ),
]

export function getCommissionByDealId (dealId: string) {
  return demoCommissions.find((c) => c.dealId === dealId)
}

export function getCommissionSummary (): CommissionSummary {
  const pipeline = demoCommissions
    .filter((c) => c.status === 'pipeline')
    .reduce((sum, c) => sum + c.consultantAmount, 0)
  const expected = demoCommissions
    .filter((c) => c.status === 'expected')
    .reduce((sum, c) => sum + c.consultantAmount, 0)
  const paid = demoCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.consultantAmount, 0)

  return {
    period: 'September 2026',
    pipeline,
    expected,
    paid,
  }
}
