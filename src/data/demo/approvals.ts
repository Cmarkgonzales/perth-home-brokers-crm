import type { Approval } from '@/domain/approvals/approval.types'

export const demoApprovals: Approval[] = [
  {
    id: 'appr-001',
    dealId: 'PHB-2026-00142',
    title: 'Finance Application — Williams Family Home',
    type: 'finance',
    status: 'pending',
    requestedAt: '2026-03-15',
    dueDate: '2026-03-20',
    assignee: 'James',
    description:
      'Finance pre-approval application pending lender review. Bank statement required before submission can proceed.',
    documentIds: ['doc-001', 'doc-002', 'doc-003', 'doc-004', 'doc-005'],
    clientName: 'Sarah & James Williams',
    dealValue: 642000,
  },
  {
    id: 'appr-002',
    dealId: 'PHB-2026-00138',
    title: 'Builder Quote — Chen Residence',
    type: 'builder',
    status: 'pending',
    requestedAt: '2026-03-14',
    dueDate: '2026-03-16',
    assignee: 'Arvin',
    description:
      'Summit Homes builder quote for Baldivis lot + Madison design. Quote exceeds initial budget by $12,000.',
    documentIds: ['doc-006', 'doc-007'],
    clientName: 'Michael Chen',
    dealValue: 518000,
  },
  {
    id: 'appr-003',
    dealId: 'PHB-2026-00129',
    title: 'Land Contract — Thompson Land Purchase',
    type: 'land',
    status: 'pending',
    requestedAt: '2026-03-12',
    dueDate: '2026-03-22',
    assignee: 'Arvin',
    description: 'Land contract review for Byford Heritage Grove lot.',
    documentIds: [],
    clientName: 'Daniel Smith',
    dealValue: 285000,
  },
]
