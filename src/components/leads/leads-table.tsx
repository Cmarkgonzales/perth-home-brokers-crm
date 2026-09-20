'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Lead } from '@/domain/leads/lead.types'
import { formatCurrency } from '@/lib/formatting'
import {
  AiLeadAssessment,
  AiQualificationButton,
} from '@/components/ai/ai-lead-assessment'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
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

export function LeadsTable ({ leads }: LeadsTableProps) {
  const [query, setQuery] = useState('')
  const [assessmentLead, setAssessmentLead] = useState<Lead | null>(null)

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
      <div className="relative w-full max-w-sm">
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
        {filteredLeads.length === 0 ? (
          <p
            className="px-4 py-8 text-center text-sm text-muted-foreground"
            role="status"
          >
            {query.trim()
              ? `No leads match “${query.trim()}”.`
              : 'No leads to display.'}
          </p>
        ) : (
          <>
            <ul className="divide-y divide-border md:hidden">
              {filteredLeads.map((lead) => (
                <li key={lead.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-text-primary hover:underline"
                      >
                        {lead.name}
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                        <span>{lead.source}</span>
                        <span aria-hidden>·</span>
                        <span className="tabular-nums">{formatCurrency(lead.budget)}</span>
                        <span aria-hidden>·</span>
                        <span>{lead.owner}</span>
                      </div>
                      <LeadStatusBadge status={lead.status} className="mt-3" />
                    </div>
                    <AiQualificationButton
                      leadName={lead.name}
                      onClick={() => setAssessmentLead(lead)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>
                      <span className="sr-only">View AI assessment</span>
                    </TableHead>
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
                        <LeadStatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell>{lead.owner}</TableCell>
                      <TableCell className="text-right">
                        <AiQualificationButton
                          leadName={lead.name}
                          onClick={() => setAssessmentLead(lead)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>

      <AiLeadAssessment
        key={assessmentLead?.id ?? 'closed'}
        lead={assessmentLead}
        open={assessmentLead !== null}
        onOpenChange={(open) => {
          if (!open) setAssessmentLead(null)
        }}
      />
    </div>
  )
}
