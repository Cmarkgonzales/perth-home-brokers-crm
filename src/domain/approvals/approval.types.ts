export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'changes_requested'
  | 'rejected'

export type ApprovalType = 'finance' | 'builder' | 'land'

export interface Approval {
  id: string
  dealId: string
  title: string
  type: ApprovalType
  status: ApprovalStatus
  requestedAt: string
  dueDate: string
  assignee: string
  description: string
  documentIds: string[]
  clientName: string
  dealValue: number
}
