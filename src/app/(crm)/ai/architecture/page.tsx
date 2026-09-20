import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const AI_TOOLS = [
  'search_clients()',
  'get_client()',
  'get_deal()',
  'get_deal_timeline()',
  'get_documents()',
  'get_tasks()',
  'get_pipeline()',
  'create_task()',
  'draft_message()',
  'summarize_deal()',
]

export default function AiArchitecturePage () {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/ai"
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to AI Copilot
        </Link>
        <PageHeader
          title="AI Architecture"
          description="How PHB AI integrates with the CRM — tools, guardrails, and human approval."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request flow</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-surface-strong p-4 text-xs leading-relaxed text-text-secondary">
{`PHB AI Copilot
      │
      ▼
 AI Gateway (NestJS)
      │
      ├── LLM API
      ├── Tools (permissioned CRM APIs)
      └── Memory / Context
      │
      ▼
 Structured Output + Guardrails
      │
      ▼
 Human Approval (consequential actions)
      │
      ▼
 Execute → Audit Log`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tool catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-text-secondary">
            AI never accesses the database directly. All operations go through
            typed, permissioned application tools.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {AI_TOOLS.map((tool) => (
              <code
                key={tool}
                className="rounded-md bg-surface-strong px-3 py-2 text-xs text-text-primary"
              >
                {tool}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security principles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-text-secondary">
          <p>• Authentication → RBAC → Resource authorization → API validation</p>
          <p>• AI recommendations require human approval for consequential actions</p>
          <p>• All AI tool calls are audit-logged with correlation IDs</p>
          <p>• PII-aware logging and document access control at every boundary</p>
        </CardContent>
      </Card>
    </div>
  )
}
