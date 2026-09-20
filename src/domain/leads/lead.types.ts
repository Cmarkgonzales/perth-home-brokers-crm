export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Converted'
  | 'Lost'

export interface Lead {
  id: string
  name: string
  source: string
  budget: number
  status: LeadStatus
  owner: string
  email?: string
  phone?: string
  clientId?: string
}
