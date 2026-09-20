'use client'

import { useState } from 'react'
import type { LeadAssessment } from '@/domain/ai/ai.types'
import type { AgentRun } from '@/domain/ai/agent.types'
import { assessLead } from '@/domain/ai/mock-copilot'
import { createLeadQualificationAgentRun } from '@/domain/ai/mock-agent'
import { formatCurrency } from '@/lib/formatting'
import { AgentTrace } from '@/components/ai/agent-trace'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Sparkles } from 'lucide-react'

interface AiLeadAssessmentProps {
  leadId: string
  leadName: string
}

function AssessmentContent ({ assessment }: { assessment: LeadAssessment }) {
  return (
    <div className="mt-4 space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-text-tertiary">Intent</p>
          <p className="font-semibold text-text-primary">{assessment.intent}</p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Est. budget</p>
          <p className="font-semibold tabular-nums">
            {formatCurrency(assessment.estimatedBudget)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Timeline</p>
          <p className="font-medium">{assessment.timeline}</p>
        </div>
        <div>
          <p className="text-xs text-text-tertiary">Finance risk</p>
          <p className="font-medium">{assessment.financeRisk}</p>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          AI summary
        </p>
        <p className="text-text-secondary">{assessment.summary}</p>
      </div>

      <div className="rounded-lg border border-phb-yellow/30 bg-[#FFFCF0] p-3">
        <p className="text-xs font-semibold text-text-tertiary">
          Recommended next action
        </p>
        <p className="mt-1 font-medium text-text-primary">
          → {assessment.recommendedAction}
        </p>
      </div>
    </div>
  )
}

export function AiLeadAssessment ({ leadId, leadName }: AiLeadAssessmentProps) {
  const [open, setOpen] = useState(false)
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null)
  const [showResult, setShowResult] = useState(false)
  const assessment = assessLead(leadId)

  function handleOpenChange (nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setAgentRun(createLeadQualificationAgentRun(leadName))
      setShowResult(false)
    } else {
      setAgentRun(null)
      setShowResult(false)
    }
  }

  if (!assessment) return null

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-phb-yellow/40 bg-surface px-2.5 text-sm font-medium hover:bg-[#FFF9E5]"
      >
        <Sparkles className="size-3.5 text-phb-yellow-dark" aria-hidden />
        AI Qualification
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
            AI Lead Assessment
          </SheetTitle>
          <SheetDescription>{leadName}</SheetDescription>
        </SheetHeader>

        {agentRun && !showResult && (
          <div className="mt-4">
            <AgentTrace
              key={agentRun.id}
              run={agentRun}
              onComplete={() => setShowResult(true)}
            />
          </div>
        )}

        {showResult && <AssessmentContent assessment={assessment} />}
      </SheetContent>
    </Sheet>
  )
}
