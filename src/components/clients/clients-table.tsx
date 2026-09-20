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
            <TableRow key={client.id}>
              <TableCell>
                <Link
                  href={`/clients/${client.id}`}
                  className="font-medium text-text-primary hover:underline"
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
  )
}
