export type ActivityType =
  | 'finance'
  | 'document'
  | 'approval'
  | 'client'
  | 'system'

export interface Activity {
  id: string
  dealId: string
  date: string
  title: string
  description: string
  type: ActivityType
}
