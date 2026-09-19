import type { Lead } from '@/types/crm'
import { demoLead } from '@/data/demo'

export const leads: Lead[] = [
  demoLead,
  {
    id: 'lead-002',
    name: 'Michael Chen',
    source: 'Referral',
    budget: 520000,
    status: 'Qualified',
    owner: 'James',
  },
  {
    id: 'lead-003',
    name: 'Emma & Tom Roberts',
    source: 'Facebook ad',
    budget: 780000,
    status: 'New',
    owner: 'Sarah',
  },
]
