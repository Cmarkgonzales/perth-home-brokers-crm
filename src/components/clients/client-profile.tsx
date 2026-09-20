import Link from 'next/link'
import {
  getActiveDealForClient,
  getActivitiesByDealId,
  getCommunicationsByClientId,
  getDealsByClientId,
  getDocumentsByDealId,
} from '@/data/demo'
import type { Client, ClientContactChannel } from '@/domain/clients/client.types'
import { formatCurrency, getInitials } from '@/lib/formatting'
import { ActivityFeed } from '@/components/activities/activity-feed'
import { ClientDocumentsPanel } from '@/components/clients/client-documents-panel'
import { CommunicationsLog } from '@/components/clients/communications-log'
import { DealStageBadge } from '@/components/deals/deal-stage-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ClientProfileProps {
  client: Client
}

const PREFERRED_CONTACT_LABELS: Record<ClientContactChannel, string> = {
  sms: 'SMS',
  email: 'Email',
  call: 'Call',
}

const tabTriggerClass =
  'h-auto rounded-none px-0 pb-3 text-sm font-medium text-text-secondary hover:text-text-primary data-active:bg-transparent data-active:font-semibold data-active:text-text-primary after:right-0 after:left-0 after:h-[2px] after:bg-phb-yellow group-data-horizontal/tabs:after:bottom-0 group-data-[variant=line]/tabs-list:after:bg-phb-yellow'

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

export function ClientProfile ({ client }: ClientProfileProps) {
  const activeDeal = getActiveDealForClient(client.id)
  const clientDeals = getDealsByClientId(client.id)
  const activities = activeDeal ? getActivitiesByDealId(activeDeal.id) : []
  const communications = getCommunicationsByClientId(client.id)
  const dealDocuments = activeDeal
    ? getDocumentsByDealId(activeDeal.id).filter((doc) => doc.required)
    : []
  const consultant = activeDeal?.owner
  const locationLine = [client.type, client.location].join(', ')
  const subtitle = consultant
    ? `${locationLine}. Consultant: ${consultant}`
    : locationLine

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
          <li>
            <Link href="/clients" className="hover:text-text-primary">
              Clients
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-secondary">{client.name}</li>
        </ol>
      </nav>

      <Card className="border-border shadow-none">
        <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
          <Avatar className="size-12" size="lg">
            <AvatarFallback className="bg-info/10 text-sm font-semibold text-info">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
              {client.name}
            </h1>
            <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <div className="-mx-4 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <TabsList
            variant="line"
            className="h-auto w-max gap-6 bg-transparent p-0"
          >
            <TabsTrigger value="overview" className={tabTriggerClass}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="deal" className={tabTriggerClass}>
              Deal
            </TabsTrigger>
            <TabsTrigger value="documents" className={tabTriggerClass}>
              Documents
            </TabsTrigger>
            <TabsTrigger value="communications" className={tabTriggerClass}>
              Communications
            </TabsTrigger>
            <TabsTrigger value="activity" className={tabTriggerClass}>
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailRow label="Phone" value={client.phone} />
                  <DetailRow label="Email" value={client.email} />
                  {client.preferredContact ? (
                    <DetailRow
                      label="Preferred contact"
                      value={PREFERRED_CONTACT_LABELS[client.preferredContact]}
                    />
                  ) : null}
                </dl>
              </CardContent>
            </Card>

            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Financial snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailRow label="Budget" value={formatCurrency(client.budget)} />
                  <DetailRow label="Deposit" value={formatCurrency(client.deposit)} />
                  {client.employment ? (
                    <DetailRow label="Employment" value={client.employment} />
                  ) : null}
                </dl>
              </CardContent>
            </Card>

            {activeDeal ? (
              <Card className="border-border shadow-none">
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <CardTitle className="text-base">Active deal</CardTitle>
                  <DealStageBadge stage={activeDeal.stage} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{activeDeal.name}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
                      {formatCurrency(activeDeal.value)}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Progress</span>
                      <span className="tabular-nums text-text-tertiary">
                        {activeDeal.progress}%
                      </span>
                    </div>
                    <Progress
                      value={activeDeal.progress}
                      className="h-2 [&_[data-slot=progress-indicator]]:bg-phb-yellow [&_[data-slot=progress-track]]:h-2"
                    />
                  </div>
                  <ButtonLink href={`/deals/${activeDeal.id}`} variant="brand">
                    Open deal workspace
                  </ButtonLink>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border shadow-none">
                <CardHeader>
                  <CardTitle className="text-base">Active deal</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  No active deal for this client.
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Recent timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities} limit={4} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deal" className="mt-6">
          {clientDeals.length > 0 ? (
            <Card className="gap-0 border-border py-0 shadow-none">
              <ul className="divide-y divide-border">
                {clientDeals.map((deal) => (
                  <li
                    key={deal.id}
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary">{deal.name}</p>
                      <p className="mt-1 text-sm text-text-tertiary">
                        Deal #{deal.id}, owned by {deal.owner}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                      <p className="text-xl font-semibold tabular-nums text-text-primary">
                        {formatCurrency(deal.value)}
                      </p>
                      <ButtonLink href={`/deals/${deal.id}`} variant="brand">
                        Open deal workspace
                      </ButtonLink>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <Card className="border-border shadow-none">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No deals for this client yet.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <ClientDocumentsPanel
            documents={dealDocuments}
            dealId={activeDeal?.id}
            dealName={activeDeal?.name ?? client.name}
          />
        </TabsContent>

        <TabsContent value="communications" className="mt-6">
          <CommunicationsLog communications={communications} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="border-border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <ActivityFeed activities={activities} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
