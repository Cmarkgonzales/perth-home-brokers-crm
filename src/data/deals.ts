import type { Deal } from '@/types/crm'
import { demoDeal } from '@/data/demo'

export const deals: Deal[] = [demoDeal]

export function getDealById (id: string): Deal | undefined {
  return deals.find((deal) => deal.id === id)
}
