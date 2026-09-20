import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MODULES = [
  'identity', 'users', 'leads', 'clients', 'deals', 'workflows',
  'tasks', 'documents', 'communications', 'packages', 'commissions',
  'approvals', 'reporting', 'ai',
]

const EVENTS = [
  'DealCreated', 'DealStageChanged', 'DocumentUploaded', 'DocumentApproved',
  'ApprovalRequested', 'ApprovalCompleted', 'TaskCompleted',
  'CommunicationSent', 'CommissionEarned',
]

export default function ArchitecturePage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Technical architecture"
        description="Future-state modular monolith for PHB Command Center."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">System overview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-surface-strong p-4 text-xs leading-relaxed text-text-secondary">
{`                    PHB Command Center
                           │
              ┌────────────┴────────────┐
              │                         │
        Web Application            AI Copilot
         (Next.js/React)          (AI Gateway)
              │                         │
              └────────────┬────────────┘
                           │
                        REST API
                           │
                  NestJS Application
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
   CRM Domain        Workflow Domain       AI Domain
       │                   │                   │
   Clients            Tasks               Agents
   Deals              Events              Tools
   Leads              Approvals           Prompts
   Documents          Automation          Guardrails
   Commissions
       │
       └───────────────────┬───────────────────┘
                           │
                      PostgreSQL
                           │
                 ┌─────────┴─────────┐
                 │                   │
               Redis            Object Storage
                 │                   │
              BullMQ              Documents
                 │
        Background Workers
                 │
       ┌─────────┼──────────┐
       │         │          │
    Twilio      GHL       Email`}
          </pre>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">NestJS modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {MODULES.map((mod) => (
                <code
                  key={mod}
                  className="rounded-md bg-surface-strong px-2 py-1 text-xs"
                >
                  {mod}/
                </code>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Domain events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-text-secondary">
              {EVENTS.map((event) => (
                <li key={event}>
                  <code className="text-xs text-text-primary">{event}</code>
                  {' → '}queue → side effects
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security &amp; integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-text-secondary">
          <p>
            <strong className="text-text-primary">Auth stack:</strong>{' '}
            Authentication → RBAC → Resource authorization → API validation → Audit logging
          </p>
          <p>
            <strong className="text-text-primary">AI safety:</strong>{' '}
            LLM never writes directly to DB. All actions via permissioned tools with human approval for consequential operations.
          </p>
          <p>
            <strong className="text-text-primary">Integration layer:</strong>{' '}
            CommunicationProvider adapter pattern — TwilioAdapter, GHLAdapter, EmailAdapter implement internal interfaces.
          </p>
          <Link
            href="/ai/architecture"
            className="inline-flex text-sm font-medium text-text-primary hover:underline"
          >
            View AI architecture details →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
