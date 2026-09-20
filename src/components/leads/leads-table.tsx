'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Lead } from '@/domain/leads/lead.types'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search } from 'lucide-react'

interface LeadsTableProps {
  leads: Lead[]
}

function getStatusVariant (status: Lead['status']) {
  switch (status) {
    case 'Converted':
      return 'bg-success/10 text-success'
    case 'Qualified':
      return 'bg-info/10 text-info'
    case 'New':
      return 'bg-surface-strong text-text-secondary'
    case 'Contacted':
      return 'bg-warning/10 text-warning'
    default:
      return ''
  }
}

export function LeadsTable ({ leads }: LeadsTableProps) {
  const [query, setQuery] = useState('')

  const filteredLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return leads

    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(normalized) ||
        lead.source.toLowerCase().includes(normalized) ||
        lead.owner.toLowerCase().includes(normalized) ||
        lead.status.toLowerCase().includes(normalized)
    )
  }, [leads, query])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search leads..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-8"
          aria-label="Search leads"
        />
      </div>

      <Card className="overflow-hidden gap-0 py-0">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Link
                  href={`/leads/${lead.id}`}
                  className="font-medium text-text-primary hover:underline"
                >
                  {lead.name}
                </Link>
              </TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>{formatCurrency(lead.budget)}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(getStatusVariant(lead.status))}
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>{lead.owner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </Card>
    </div>
  )
}
