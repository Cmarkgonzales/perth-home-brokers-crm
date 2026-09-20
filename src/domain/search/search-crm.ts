import type { Client } from '@/domain/clients/client.types'
import type { Deal } from '@/domain/deals/deal.types'
import type { Lead } from '@/domain/leads/lead.types'

export type CrmSearchEntity = 'lead' | 'client' | 'deal'

export interface CrmSearchResult {
  id: string
  entity: CrmSearchEntity
  title: string
  href: string
}

export const CRM_SEARCH_ENTITY_LABELS: Record<CrmSearchEntity, string> = {
  lead: 'Lead',
  client: 'Client',
  deal: 'Deal',
}

export const MAX_CRM_SEARCH_RESULTS = 8

function normalize (value: string): string {
  return value.trim().toLowerCase()
}

function digits (value: string): string {
  return value.replace(/\D/g, '')
}

function matchesText (query: string, values: Array<string | undefined>): boolean {
  return values.some((value) => {
    if (!value) return false
    return normalize(value).includes(query)
  })
}

function matchesPhone (queryDigits: string, phone?: string): boolean {
  if (queryDigits.length < 3 || !phone) return false
  return digits(phone).includes(queryDigits)
}

export function searchCrm ({
  query,
  leads,
  clients,
  deals,
}: {
  query: string
  leads: Lead[]
  clients: Client[]
  deals: Deal[]
}): CrmSearchResult[] {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  const queryDigits = digits(normalizedQuery)
  const results: CrmSearchResult[] = []

  for (const deal of deals) {
    if (!matchesText(normalizedQuery, [deal.name, deal.id, deal.owner])) {
      continue
    }

    results.push({
      id: `deal-${deal.id}`,
      entity: 'deal',
      title: deal.name,
      href: `/deals/${deal.id}`,
    })
  }

  for (const client of clients) {
    if (
      !matchesText(normalizedQuery, [
        client.name,
        client.id,
        client.email,
        client.phone,
        client.location,
      ]) &&
      !matchesPhone(queryDigits, client.phone)
    ) {
      continue
    }

    results.push({
      id: `client-${client.id}`,
      entity: 'client',
      title: client.name,
      href: `/clients/${client.id}`,
    })
  }

  const matchedClientHrefs = new Set(
    results.filter((result) => result.entity === 'client').map((result) => result.href)
  )

  for (const lead of leads) {
    // Converted leads are represented by their client record in global search.
    if (
      lead.status === 'Converted' &&
      lead.clientId &&
      matchedClientHrefs.has(`/clients/${lead.clientId}`)
    ) {
      continue
    }

    if (
      !matchesText(normalizedQuery, [
        lead.name,
        lead.id,
        lead.email,
        lead.phone,
        lead.owner,
        lead.source,
      ]) &&
      !matchesPhone(queryDigits, lead.phone)
    ) {
      continue
    }

    results.push({
      id: `lead-${lead.id}`,
      entity: 'lead',
      title: lead.name,
      href: `/leads/${lead.id}`,
    })
  }

  return results.slice(0, MAX_CRM_SEARCH_RESULTS)
}
