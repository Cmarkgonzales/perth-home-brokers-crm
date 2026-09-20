export type DealStage =
  | 'lead'
  | 'qualified'
  | 'finance'
  | 'land'
  | 'builder'
  | 'package'
  | 'drafting'
  | 'approval'
  | 'construction'
  | 'settlement'

export interface Deal {
  id: string
  name: string
  clientId: string
  value: number
  stage: DealStage
  progress: number
  owner: string
  nextAction: string
  nextActionDue: string
  atRisk?: boolean
}
