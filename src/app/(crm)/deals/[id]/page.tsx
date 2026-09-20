import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getClientById,
  getDealById,
  getDocumentsByDealId,
  getMissingDocumentsForDeal,
} from '@/data/demo'
import { formatCurrency } from '@/lib/formatting'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle } from 'lucide-react'

export default async function DealDetailPage ({
  params,
}: PageProps<'/deals/[id]'>) {
  const { id } = await params
  const deal = getDealById(id)

  if (!deal) {
    notFound()
  }

  const client = getClientById(deal.clientId)
  const documents = getDocumentsByDealId(deal.id)
  const missingDocuments = getMissingDocumentsForDeal(deal.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/deals"
            className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to deals
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-[32px] font-semibold tracking-tight text-text-primary">
              {deal.name}
            </h1>
            {deal.atRisk && (
              <AlertTriangle className="size-5 text-danger" aria-label="At risk" />
            )}
          </div>
          <p className="font-mono text-sm text-text-tertiary">{deal.id}</p>
          {client && (
            <Link
              href={`/clients/${client.id}`}
              className="mt-1 inline-block text-sm font-medium text-text-primary hover:underline"
            >
              {client.name}
            </Link>
          )}
        </div>
        <div className="text-right">
          <p className="text-[32px] font-semibold tracking-tight text-text-primary">
            {formatCurrency(deal.value)}
          </p>
          <DealStageBadge stage={deal.stage} className="mt-2" />
        </div>
      </div>

      <Card className="border-border shadow-none">
        <CardContent className="space-y-2 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Deal progress</span>
            <span>{deal.progress}%</span>
          </div>
          <Progress value={deal.progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Next action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{deal.nextAction}</p>
            <p className="text-sm text-muted-foreground">
              Due: {deal.nextActionDue} · Owner: {deal.owner}
            </p>
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-lg bg-phb-yellow px-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-phb-yellow-dark"
            >
              Take action
            </button>
          </CardContent>
        </Card>

        {client && (
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{client.name}</p>
              <p className="text-muted-foreground">{client.type}</p>
              <p>{client.location}</p>
              <p>{client.email}</p>
              <p>{client.phone}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Documents checklist</CardTitle>
          {missingDocuments.length > 0 && (
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              {missingDocuments.length} missing
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <span>{doc.name}</span>
                <Badge
                  variant="secondary"
                  className={
                    doc.status === 'missing'
                      ? 'bg-danger/10 text-danger'
                      : doc.status === 'review'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                  }
                >
                  {doc.status}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardContent className="py-6 text-sm text-muted-foreground">
          Full Deal Workspace with stage stepper, timeline, and package summary
          arrives in Plan 2.
        </CardContent>
      </Card>
    </div>
  )
}
