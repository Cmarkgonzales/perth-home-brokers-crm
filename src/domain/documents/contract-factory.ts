import type { Client } from '@/domain/clients/client.types'
import type { Deal } from '@/domain/deals/deal.types'
import { EMPTY_CONTRACT_CONTENT } from '@/domain/documents/contract.constants'
import type { ContractDocument, ContractSignatory } from '@/domain/documents/contract.types'

function brokerEmail (ownerName: string): string {
  const slug = ownerName.toLowerCase().replace(/\s+/g, '.')
  return `${slug}@phb.example`
}

export function createDefaultSignatories (
  deal: Deal,
  client: Client
): ContractSignatory[] {
  return [
    {
      id: `sig-${deal.id}-sender`,
      role: 'sender',
      name: `${deal.owner} (PHB)`,
      email: brokerEmail(deal.owner),
      status: 'pending',
    },
    {
      id: `sig-${deal.id}-recipient`,
      role: 'recipient',
      name: client.name,
      email: client.email,
      status: 'pending',
    },
  ]
}

export function createBlankContract (
  deal: Deal,
  client: Client,
  id: string,
  title: string,
  updatedAt: string
): ContractDocument {
  return {
    id,
    dealId: deal.id,
    title,
    content: structuredClone(EMPTY_CONTRACT_CONTENT),
    signatories: createDefaultSignatories(deal, client),
    source: 'created',
    updatedAt,
  }
}

export function createContractId (): string {
  return `contract-${crypto.randomUUID()}`
}

export function createSignatoryId (): string {
  return `sig-${crypto.randomUUID()}`
}
