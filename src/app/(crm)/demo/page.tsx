import Link from 'next/link'
import { DEMO_DEAL_ID } from '@/lib/constants'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Executive dashboard',
    description: '7 deals need attention — KPIs, pipeline, AI brief',
    href: '/dashboard',
  },
  {
    step: 2,
    title: 'Sarah Williams client profile',
    description: '360° view — contact, financial snapshot, active deal',
    href: '/clients/client-001',
  },
  {
    step: 3,
    title: 'Deal workspace',
    description: 'Williams Family Home — stage stepper, next action, documents',
    href: `/deals/${DEMO_DEAL_ID}`,
  },
  {
    step: 4,
    title: 'Documents hub',
    description: 'Missing bank statement — AI document check',
    href: '/documents?deal=PHB-2026-00142',
  },
  {
    step: 5,
    title: 'AI Copilot',
    description: '"What should I do next with Sarah\'s deal?"',
    href: '/ai',
  },
  {
    step: 6,
    title: 'Package builder',
    description: 'Alkimos land + The Horizon = $593,500 demo package',
    href: '/packages/builder?dealId=PHB-2026-00142',
  },
  {
    step: 7,
    title: 'Agent workflow',
    description: 'Draft follow-up → human approve → activity logged',
    href: '/ai',
  },
  {
    step: 8,
    title: 'Technical architecture',
    description: 'Modular monolith, events, AI bounded context',
    href: '/architecture',
  },
]

export default function DemoPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Demo script"
        description="Presenter checklist for the PHB Command Center interview demo."
      />

      <Card className="border-phb-yellow/30 bg-[#FFFCF0] shadow-none">
        <CardContent className="py-4 text-sm text-text-secondary">
          Follow these steps in order. Each link opens the relevant screen.
          Total demo time: ~5 minutes.
        </CardContent>
      </Card>

      <ol className="space-y-3">
        {DEMO_STEPS.map(({ step, title, description, href }) => (
          <li key={step}>
            <Link
              href={href}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-table-hover"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-phb-red text-sm font-semibold text-white">
                {step}
              </span>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{title}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
              </div>
              <CheckCircle2 className="size-5 shrink-0 text-text-tertiary" aria-hidden />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
