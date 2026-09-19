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

export interface Client {
  id: string
  name: string
  type: 'First Home Buyer' | 'Investor' | 'Home Buyer'
  email: string
  phone: string
  budget: number
  deposit: number
  location: string
}

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
}

export interface Lead {
  id: string
  name: string
  source: string
  budget: number
  status: string
  owner: string
}

export interface Document {
  id: string
  dealId: string
  name: string
  status: 'complete' | 'missing' | 'review'
  uploadedAt?: string
}

export interface Activity {
  id: string
  dealId: string
  date: string
  title: string
  description: string
  type: 'finance' | 'document' | 'approval' | 'client' | 'system'
}
