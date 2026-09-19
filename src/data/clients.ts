import type { Client } from '@/types/crm'
import { demoClient } from '@/data/demo'

export const clients: Client[] = [demoClient]

export function getClientById (id: string): Client | undefined {
  return clients.find((client) => client.id === id)
}
