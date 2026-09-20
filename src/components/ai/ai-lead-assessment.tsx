'use client'

import { useId, useMemo, useState } from 'react'
import type { LeadAssessment, LeadFollowUpChannel } from '@/domain/ai/ai.types'
import {
  getFollowUpTaskDraft,
  getLeadInitials,
  LEAD_FOLLOW_UP_CHANNEL_LABELS,
  LEAD_FOLLOW_UP_CHANNELS,
} from '@/domain/ai/lead-assessment'
import { assessLead } from '@/domain/ai/mock-copilot'
import type { Lead } from '@/domain/leads/lead.types'
import { formatCurrency } from '@/lib/formatting'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageSquare, Phone, Sparkles } from 'lucide-react'

interface AiQualificationButtonProps {
  leadName: string
  onClick?: () => void
}

interface AiLeadAssessmentProps {
  lead: Lead | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
}

interface CreatedFollowUpTask {
  channel: LeadFollowUpChannel
  title: string
  assignee: string
}

function intentClass (intent: LeadAssessment['intent']) {
  if (intent === 'High') return 'bg-info/10 text-info'
  if (intent === 'Low') return 'bg-surface-strong text-text-secondary'
  return 'bg-warning/10 text-warning'
}

function financeRiskClass (risk: LeadAssessment['financeRisk']) {
  if (risk === 'High') return 'bg-danger/10 text-danger'
  if (risk === 'Low') return 'bg-success/10 text-success'
  return 'bg-warning/10 text-warning'
}

const CHANNEL_ICONS = {
  call: Phone,
  sms: MessageSquare,
  email: Mail,
} as const

export function AiQualificationButton ({
  leadName,
  onClick,
}: AiQualificationButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="shrink-0 border-phb-yellow/40 hover:bg-[#FFF9E5]"
      onClick={onClick}
      aria-label={`View AI assessment for ${leadName}`}
    >
      <Sparkles className="size-3.5 text-phb-yellow-dark" aria-hidden />
      View AI assessment
    </Button>
  )
}

function AssessmentMetrics ({ assessment }: { assessment: LeadAssessment }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      <div className="flex items-center justify-between gap-3 py-3">
        <dt className="text-sm text-text-secondary">Intent</dt>
        <dd>
          <Badge variant="secondary" className={intentClass(assessment.intent)}>
            {assessment.intent}
          </Badge>
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 py-3">
        <dt className="text-sm text-text-secondary">Estimated budget</dt>
        <dd className="text-sm font-medium tabular-nums text-text-primary">
          {formatCurrency(assessment.estimatedBudget)}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 py-3">
        <dt className="text-sm text-text-secondary">Timeline</dt>
        <dd className="text-sm font-medium text-text-primary">
          {assessment.timeline}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 py-3">
        <dt className="text-sm text-text-secondary">Finance risk</dt>
        <dd>
          <Badge
            variant="secondary"
            className={financeRiskClass(assessment.financeRisk)}
          >
            {assessment.financeRisk}
          </Badge>
        </dd>
      </div>
    </dl>
  )
}

function FollowUpTaskForm ({
  formId,
  lead,
  assessment,
  createdTask,
  onCreate,
}: {
  formId: string
  lead: Lead
  assessment: LeadAssessment
  createdTask: CreatedFollowUpTask | null
  onCreate: (task: CreatedFollowUpTask) => void
}) {
  const titleId = useId()
  const notesId = useId()
  const [channel, setChannel] = useState<LeadFollowUpChannel>(
    assessment.recommendedChannel
  )
  const [title, setTitle] = useState(
    () => getFollowUpTaskDraft(lead, assessment, assessment.recommendedChannel).title
  )
  const [notes, setNotes] = useState(
    () => getFollowUpTaskDraft(lead, assessment, assessment.recommendedChannel).notes
  )

  function handleChannelChange (nextChannel: LeadFollowUpChannel) {
    const draft = getFollowUpTaskDraft(lead, assessment, nextChannel)
    setChannel(nextChannel)
    setTitle(draft.title)
    setNotes(draft.notes)
  }

  if (createdTask) {
    return (
      <div
        className="rounded-lg border border-success/20 bg-success/5 p-3"
        role="status"
      >
        <p className="text-sm font-medium text-text-primary">
          Task created for {createdTask.assignee}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {LEAD_FOLLOW_UP_CHANNEL_LABELS[createdTask.channel]} · {createdTask.title}
        </p>
      </div>
    )
  }

  return (
    <form
      id={formId}
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault()
        if (!title.trim()) return
        onCreate({
          channel,
          title: title.trim(),
          assignee: lead.owner,
        })
      }}
    >
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Follow-up channel
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {LEAD_FOLLOW_UP_CHANNELS.map((option) => {
            const Icon = CHANNEL_ICONS[option]
            const isSelected = channel === option

            return (
              <label
                key={option}
                className={cn(
                  'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                  isSelected
                    ? 'border-phb-yellow bg-[#FFF9E5] text-text-primary'
                    : 'border-border bg-surface text-text-secondary hover:bg-surface-muted'
                )}
              >
                <input
                  type="radio"
                  name="follow-up-channel"
                  value={option}
                  checked={isSelected}
                  onChange={() => handleChannelChange(option)}
                  className="sr-only"
                />
                <Icon className="size-3.5" aria-hidden />
                {LEAD_FOLLOW_UP_CHANNEL_LABELS[option]}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor={titleId} className="text-sm font-medium text-text-primary">
          Task title
        </label>
        <Input
          id={titleId}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor={notesId} className="text-sm font-medium text-text-primary">
          Notes
        </label>
        <Textarea
          id={notesId}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
        />
      </div>
    </form>
  )
}

export function AiLeadAssessment ({
  lead,
  open: openProp,
  onOpenChange,
  showTrigger = false,
}: AiLeadAssessmentProps) {
  const formId = useId()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [createdTask, setCreatedTask] = useState<CreatedFollowUpTask | null>(null)
  const [isComposingTask, setIsComposingTask] = useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen
  const assessment = useMemo(
    () => (lead ? assessLead(lead) : null),
    [lead]
  )

  function handleOpenChange (nextOpen: boolean) {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    if (!nextOpen) {
      setCreatedTask(null)
      setIsComposingTask(false)
    }
    onOpenChange?.(nextOpen)
  }

  if (!lead || !assessment) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <SheetTrigger
          render={
            <Button
              variant="outline"
              className="border-phb-yellow/40 hover:bg-[#FFF9E5]"
              aria-label={`View AI assessment for ${lead.name}`}
            />
          }
        >
          <Sparkles className="size-3.5 text-phb-yellow-dark" aria-hidden />
          View AI assessment
        </SheetTrigger>
      ) : null}

      <SheetContent
        side="left"
        className="gap-0 bg-surface p-0 data-[side=left]:w-full data-[side=left]:sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold text-text-primary">
            <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
            AI lead assessment
          </SheetTitle>
          <SheetDescription className="sr-only">
            Assessment summary and follow-up task for {lead.name}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-surface-strong text-xs font-medium text-text-secondary">
                {getLeadInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">{lead.name}</p>
              <p className="truncate text-sm text-text-secondary">
                from {lead.source}
              </p>
            </div>
          </div>

          <AssessmentMetrics assessment={assessment} />

          <section className="rounded-lg border border-border bg-surface-muted p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              AI summary
            </h3>
            <p className="mt-2 text-sm text-text-secondary">{assessment.summary}</p>
          </section>

          <section className="rounded-lg border border-phb-yellow/30 bg-[#FFFCF0] p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Recommended next action
            </h3>
            <p className="mt-2 text-sm font-medium text-text-primary">
              {assessment.recommendedAction}
            </p>
          </section>

          <p className="text-xs text-text-tertiary">
            The AI suggests next steps for the consultant. It doesn&apos;t assess
            loan eligibility.
          </p>
        </div>

        {isComposingTask || createdTask ? (
          <div className="shrink-0 space-y-3 border-t border-border px-4 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              Create follow-up task
            </h3>
            <FollowUpTaskForm
              key={lead.id}
              formId={formId}
              lead={lead}
              assessment={assessment}
              createdTask={createdTask}
              onCreate={setCreatedTask}
            />
          </div>
        ) : null}

        <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </Button>
          {createdTask ? null : isComposingTask ? (
            <Button type="submit" form={formId} variant="brand">
              Create task for {lead.owner}
            </Button>
          ) : (
            <Button
              type="button"
              variant="brand"
              onClick={() => setIsComposingTask(true)}
            >
              Create task for {lead.owner}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
