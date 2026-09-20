export type CommissionStatus = 'pipeline' | 'expected' | 'paid'

export interface CommissionSplit {
  party: string
  percentage: number
  amount: number
}

export interface Commission {
  id: string
  dealId: string
  dealName: string
  consultant: string
  dealValue: number
  commissionRate: number
  grossCommission: number
  consultantAmount: number
  officeAmount: number
  status: CommissionStatus
  period: string
}

export interface CommissionSummary {
  period: string
  pipeline: number
  expected: number
  paid: number
}
