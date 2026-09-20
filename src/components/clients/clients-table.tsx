import Link from 'next/link'
import { demoDeals } from '@/data/demo'
import type { Client } from '@/domain/clients/client.types'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ClientsTableProps {
  clients: Client[]
}

function getClientDealSummary (clientId: string) {
  const clientDeals = demoDeals.filter((deal) => deal.clientId === clientId)
  const activeDeal =
    clientDeals.find((deal) => deal.stage !== 'settlement') ?? clientDeals[0]

  return {
    dealCount: clientDeals.length,
    activeDeal,
  }
}

export function ClientsTable ({ clients }: ClientsTableProps) {
  return (
    <>
      <ul className="divide-y divide-border md:hidden">
        {clients.map((client) => {
          const { dealCount, activeDeal } = getClientDealSummary(client.id)

          return (
            <li key={client.id}>
              <Link
                href={`/clients/${client.id}`}
                className="block p-4 transition-colors hover:bg-table-hover focus-visible:bg-table-hover focus-visible:outline-none"
              >
                <p className="font-medium text-text-primary">{client.name}</p>
                <p className="text-xs text-text-tertiary">{client.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{client.type}</Badge>
                  <span className="text-sm text-text-secondary">{client.location}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-text-tertiary">
                    {dealCount} {dealCount === 1 ? 'deal' : 'deals'}
                  </span>
                  {activeDeal ? (
                    <DealStageBadge stage={activeDeal.stage} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  <span className="text-text-secondary">
                    {activeDeal?.owner ?? '—'}
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Active stage</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => {
              const { dealCount, activeDeal } = getClientDealSummary(client.id)

              return (
                <TableRow key={client.id} className="relative">
                  <TableCell>
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-text-primary after:absolute after:inset-0 hover:text-text-primary"
                    >
                      {client.name}
                    </Link>
                    <p className="text-xs text-text-tertiary">{client.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{client.type}</Badge>
                  </TableCell>
                  <TableCell>{client.location}</TableCell>
                  <TableCell>{dealCount}</TableCell>
                  <TableCell>
                    {activeDeal ? (
                      <DealStageBadge stage={activeDeal.stage} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{activeDeal?.owner ?? '—'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
