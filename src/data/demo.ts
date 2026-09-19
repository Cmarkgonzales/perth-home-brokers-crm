import type {
  Activity,
  Client,
  Deal,
  Document,
  Lead,
} from '@/types/crm'

export const demoClient: Client = {
  id: 'client-001',
  name: 'Sarah & James Williams',
  type: 'First Home Buyer',
  email: 'sarah@example.com',
  phone: '0400 123 456',
  budget: 650000,
  deposit: 80000,
  location: 'Alkimos',
}

export const demoDeal: Deal = {
  id: 'PHB-2026-00142',
  name: 'Williams Family Home',
  clientId: 'client-001',
  value: 642000,
  stage: 'finance',
  progress: 68,
  owner: 'James',
  nextAction: 'Review finance documents',
  nextActionDue: 'Today',
}

export const demoLead: Lead = {
  id: 'lead-001',
  name: 'Sarah & James Williams',
  source: 'Website enquiry',
  budget: 650000,
  status: 'Converted',
  owner: 'James',
}

export const demoDocuments: Document[] = [
  {
    id: 'doc-001',
    dealId: 'PHB-2026-00142',
    name: 'Passport',
    status: 'complete',
  },
  {
    id: 'doc-002',
    dealId: 'PHB-2026-00142',
    name: "Driver's Licence",
    status: 'complete',
  },
  {
    id: 'doc-003',
    dealId: 'PHB-2026-00142',
    name: 'Sarah Payslip',
    status: 'complete',
  },
  {
    id: 'doc-004',
    dealId: 'PHB-2026-00142',
    name: 'James Payslip',
    status: 'complete',
  },
  {
    id: 'doc-005',
    dealId: 'PHB-2026-00142',
    name: 'Bank Statement',
    status: 'missing',
  },
]

export const demoActivities: Activity[] = [
  {
    id: 'act-001',
    dealId: 'PHB-2026-00142',
    date: '2026-03-18',
    title: 'Finance pre-approval submitted',
    description: 'Application sent to preferred lender for review.',
    type: 'finance',
  },
  {
    id: 'act-002',
    dealId: 'PHB-2026-00142',
    date: '2026-03-17',
    title: 'Payslips uploaded',
    description: 'Sarah and James payslips received and verified.',
    type: 'document',
  },
  {
    id: 'act-003',
    dealId: 'PHB-2026-00142',
    date: '2026-03-15',
    title: 'Initial consultation completed',
    description: 'Budget and location preferences confirmed.',
    type: 'client',
  },
]
