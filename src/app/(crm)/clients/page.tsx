import { clients } from '@/data/clients'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatCurrency (value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ClientsPage () {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Clients</h2>
        <p className="text-sm text-muted-foreground">
          Manage client profiles and buying preferences.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Deposit</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{client.type}</Badge>
              </TableCell>
              <TableCell>{client.location}</TableCell>
              <TableCell>{formatCurrency(client.budget)}</TableCell>
              <TableCell>{formatCurrency(client.deposit)}</TableCell>
              <TableCell className="text-muted-foreground">
                {client.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
