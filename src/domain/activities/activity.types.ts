export type TimelineFilter =
  | 'finance'
  | 'admin'
  | 'builder'
  | 'client'
  | 'ai'

/** @deprecated Use category for timeline filters */
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
  category: TimelineFilter
  isToday?: boolean
}
