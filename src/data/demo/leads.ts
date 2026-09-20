import type { Lead } from '@/domain/leads/lead.types'

export const demoLeads: Lead[] = [
  {
    id: 'lead-001',
    name: 'Sarah & James Williams',
    source: 'Website enquiry',
    budget: 650000,
    status: 'Converted',
    owner: 'James',
    email: 'sarah.williams@example.com',
    phone: '0400 123 456',
    clientId: 'client-001',
  },
  {
    id: 'lead-002',
    name: 'Michael Chen',
    source: 'Referral',
    budget: 520000,
    status: 'Qualified',
    owner: 'James',
    email: 'michael.chen@example.com',
    phone: '0411 234 567',
    clientId: 'client-002',
  },
  {
    id: 'lead-003',
    name: 'Emma & Tom Roberts',
    source: 'Facebook ad',
    budget: 780000,
    status: 'New',
    owner: 'Sarah',
    email: 'emma.roberts@example.com',
    phone: '0433 456 789',
  },
  {
    id: 'lead-004',
    name: 'Daniel Smith',
    source: 'Open home',
    budget: 480000,
    status: 'Contacted',
    owner: 'Jay',
    email: 'daniel.smith@example.com',
    phone: '0422 345 678',
    clientId: 'client-003',
  },
]

export const demoLead = demoLeads[0]
