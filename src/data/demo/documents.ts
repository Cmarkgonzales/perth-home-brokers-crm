import type { Document } from '@/domain/documents/document.types'

export const demoDocuments: Document[] = [
  {
    id: 'doc-001',
    dealId: 'PHB-2026-00142',
    name: 'Passport',
    status: 'complete',
    uploadedAt: '2026-03-10',
  },
  {
    id: 'doc-002',
    dealId: 'PHB-2026-00142',
    name: "Driver's Licence",
    status: 'complete',
    uploadedAt: '2026-03-10',
  },
  {
    id: 'doc-003',
    dealId: 'PHB-2026-00142',
    name: 'Sarah Payslip',
    status: 'complete',
    uploadedAt: '2026-03-17',
  },
  {
    id: 'doc-004',
    dealId: 'PHB-2026-00142',
    name: 'James Payslip',
    status: 'complete',
    uploadedAt: '2026-03-17',
  },
  {
    id: 'doc-005',
    dealId: 'PHB-2026-00142',
    name: 'Bank Statement',
    status: 'missing',
  },
  {
    id: 'doc-006',
    dealId: 'PHB-2026-00138',
    name: 'Builder Quote',
    status: 'review',
    uploadedAt: '2026-03-14',
  },
  {
    id: 'doc-007',
    dealId: 'PHB-2026-00138',
    name: 'Finance Pre-approval',
    status: 'complete',
    uploadedAt: '2026-03-01',
  },
]
