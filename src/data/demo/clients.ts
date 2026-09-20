import type { Client } from '@/domain/clients/client.types'

export const demoClients: Client[] = [
  {
    id: 'client-001',
    name: 'Sarah & James Williams',
    type: 'First Home Buyer',
    email: 'sarah.williams@example.com',
    phone: '0400 123 456',
    budget: 650000,
    deposit: 80000,
    location: 'Alkimos',
  },
  {
    id: 'client-002',
    name: 'Michael Chen',
    type: 'Home Buyer',
    email: 'michael.chen@example.com',
    phone: '0411 234 567',
    budget: 520000,
    deposit: 65000,
    location: 'Baldivis',
  },
  {
    id: 'client-003',
    name: 'Daniel Smith',
    type: 'Investor',
    email: 'daniel.smith@example.com',
    phone: '0422 345 678',
    budget: 480000,
    deposit: 95000,
    location: 'Byford',
  },
]

export const demoClient = demoClients[0]
