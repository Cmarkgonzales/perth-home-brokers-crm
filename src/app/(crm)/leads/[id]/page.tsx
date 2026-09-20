import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLeadById } from '@/data/demo'
import { formatCurrency } from '@/lib/formatting'
import { AiLeadAssessment } from '@/components/ai/ai-lead-assessment'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LeadDetailPage ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = getLeadById(id)

  if (!lead) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/leads"
            className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to leads
          </Link>
          <h1 className="text-[32px] font-semibold tracking-tight text-text-primary">
            {lead.name}
          </h1>
          <p className="text-sm text-text-secondary">{lead.source}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{lead.status}</Badge>
          <AiLeadAssessment leadId={lead.id} leadName={lead.name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Contact information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {lead.email && <p>{lead.email}</p>}
            {lead.phone && <p>{lead.phone}</p>}
            <div className="flex justify-between pt-2">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium">{formatCurrency(lead.budget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span>{lead.owner}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Qualification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              {lead.status === 'Converted'
                ? 'This lead has been converted to a client.'
                : 'Review lead details and schedule a consultation to qualify.'}
            </p>
            {lead.status !== 'Converted' && (
              <button
                type="button"
                className="inline-flex h-8 items-center rounded-lg bg-phb-yellow px-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-phb-yellow-dark"
              >
                Convert to Client
              </button>
            )}
            {lead.clientId && (
              <Link
                href={`/clients/${lead.clientId}`}
                className="inline-flex text-sm font-medium text-text-primary hover:underline"
              >
                View client profile →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
