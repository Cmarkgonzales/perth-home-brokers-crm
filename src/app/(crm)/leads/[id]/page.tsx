import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Mail, Phone } from 'lucide-react'
import { getLeadById } from '@/data/demo'
import { formatCurrency } from '@/lib/formatting'
import { AiLeadAssessment } from '@/components/ai/ai-lead-assessment'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ContactItem ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-text-tertiary" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-tertiary">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  )
}

function DetailRow ({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="text-right text-sm font-medium text-text-primary">{value}</dd>
    </div>
  )
}

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

  const canConvert = lead.status !== 'Converted'

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/leads" className="hover:text-text-primary">
              Leads
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">{lead.name}</li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[32px]">
            {lead.name}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{lead.source}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LeadStatusBadge status={lead.status} />
          <AiLeadAssessment lead={lead} showTrigger />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Contact information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {lead.email ? (
                <ContactItem icon={Mail} label="Email" value={lead.email} />
              ) : null}
              {lead.phone ? (
                <ContactItem icon={Phone} label="Phone" value={lead.phone} />
              ) : null}
            </div>
            <dl className="border-t border-border pt-2">
              <DetailRow label="Budget" value={formatCurrency(lead.budget)} />
              <DetailRow label="Owner" value={lead.owner} />
            </dl>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Qualification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-text-secondary">
              {lead.status === 'Converted'
                ? 'This lead has been converted to a client.'
                : 'Review lead details and schedule a consultation to qualify.'}
            </p>
            {canConvert || lead.clientId ? (
              <div className="flex flex-wrap items-center gap-3">
                {canConvert ? (
                  <Button type="button" variant="brand">
                    Convert to Client
                  </Button>
                ) : null}
                {lead.clientId ? (
                  <ButtonLink
                    href={`/clients/${lead.clientId}`}
                    variant="outline"
                  >
                    View client profile
                  </ButtonLink>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
