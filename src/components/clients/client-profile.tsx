import Link from 'next/link'
import {
  getActiveDealForClient,
  getActivitiesByDealId,
  getCommunicationsByClientId,
  getDealsByClientId,
  getDocumentsByDealId,
} from '@/data/demo'
import type { Client } from '@/domain/clients/client.types'
import { formatCurrency } from '@/lib/formatting'
import { ActivityFeed } from '@/components/activities/activity-feed'
import { CommunicationsLog } from '@/components/clients/communications-log'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface ClientProfileProps {
  client: Client
}

export function ClientProfile ({ client }: ClientProfileProps) {
  const activeDeal = getActiveDealForClient(client.id)
  const clientDeals = getDealsByClientId(client.id)
  const activities = activeDeal
    ? getActivitiesByDealId(activeDeal.id)
    : []
  const communications = getCommunicationsByClientId(client.id)
  const dealDocuments = activeDeal
    ? getDocumentsByDealId(activeDeal.id)
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/clients"
            className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to clients
          </Link>
          <h1 className="text-[32px] font-semibold tracking-tight text-text-primary">
            {client.name}
          </h1>
          <p className="text-sm text-text-secondary">{client.type}</p>
        </div>
        <Badge variant="secondary">{client.location}</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deal">Deal</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{client.email}</p>
                <p>{client.phone}</p>
                <p className="text-muted-foreground">{client.location}</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Financial snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">{formatCurrency(client.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit</span>
                  <span className="font-medium">{formatCurrency(client.deposit)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {activeDeal && (
            <Card className="border-border shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Active deal</CardTitle>
                <DealStageBadge stage={activeDeal.stage} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{activeDeal.name}</p>
                    <p className="text-sm font-mono text-text-tertiary">{activeDeal.id}</p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(activeDeal.value)}
                    </p>
                  </div>
                  <Link
                    href={`/deals/${activeDeal.id}`}
                    className="inline-flex h-8 items-center rounded-lg bg-phb-yellow px-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-phb-yellow-dark"
                  >
                    Open deal
                  </Link>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{activeDeal.progress}%</span>
                  </div>
                  <Progress value={activeDeal.progress} className="h-2" />
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Next: </span>
                  {activeDeal.nextAction} — {activeDeal.nextActionDue}
                </p>
              </CardContent>
            </Card>
          )}

          {activities.length > 0 && (
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Recent activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={activities} limit={5} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deal" className="mt-6">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">All deals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clientDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-table-hover"
                >
                  <div>
                    <p className="font-medium">{deal.name}</p>
                    <p className="text-xs font-mono text-text-tertiary">{deal.id}</p>
                  </div>
                  <div className="text-right">
                    <DealStageBadge stage={deal.stage} />
                    <p className="mt-1 text-sm font-medium">
                      {formatCurrency(deal.value)}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          {dealDocuments.length > 0 ? (
            <Card className="border-border shadow-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Deal documents</CardTitle>
                {activeDeal && (
                  <Link
                    href={`/documents?deal=${activeDeal.id}`}
                    className="text-sm text-text-secondary hover:underline"
                  >
                    View in hub
                  </Link>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dealDocuments.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="inline-flex items-center gap-2">
                        {doc.status === 'complete' && (
                          <CheckCircle2 className="size-4 text-success" aria-hidden />
                        )}
                        {doc.status === 'missing' && (
                          <AlertCircle className="size-4 text-danger" aria-hidden />
                        )}
                        {doc.status === 'review' && (
                          <Clock className="size-4 text-warning" aria-hidden />
                        )}
                        {doc.name}
                      </span>
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
          ) : (
            <Card className="border-border shadow-none">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No documents for this client&apos;s active deal.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <CommunicationsLog communications={communications} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          {activities.length > 0 ? (
            <Card className="border-border shadow-none">
              <CardContent className="pt-6">
                <ActivityFeed activities={activities} />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-none">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No activity recorded yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
