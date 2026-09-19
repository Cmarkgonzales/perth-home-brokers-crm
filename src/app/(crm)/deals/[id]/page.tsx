import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getClientById } from '@/data/clients'
import { getDealById } from '@/data/deals'
import { demoDocuments } from '@/data/demo'
import { DEAL_STAGE_LABELS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function formatCurrency (value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function DealDetailPage ({
  params,
}: PageProps<'/deals/[id]'>) {
  const { id } = await params
  const deal = getDealById(id)

  if (!deal) {
    notFound()
  }

  const client = getClientById(deal.clientId)
  const documents = demoDocuments.filter((doc) => doc.dealId === deal.id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/deals"
            className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to deals
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight">{deal.name}</h2>
          <p className="text-sm text-muted-foreground">{deal.id}</p>
        </div>
        <Badge variant="secondary">{DEAL_STAGE_LABELS[deal.stage]}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value</span>
              <span className="font-medium">{formatCurrency(deal.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span>{deal.owner}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress</span>
                <span>{deal.progress}%</span>
              </div>
              <Progress value={deal.progress} className="h-2" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next action</span>
              <span>{deal.nextActionDue}</span>
            </div>
            <p>{deal.nextAction}</p>
          </CardContent>
        </Card>

        {client && (
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <span>{doc.name}</span>
                <Badge
                  variant={doc.status === 'missing' ? 'destructive' : 'secondary'}
                >
                  {doc.status}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
