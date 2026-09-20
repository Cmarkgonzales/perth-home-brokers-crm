'use client'

import { useEffect, useRef, useState } from 'react'
import type { AgentRun } from '@/domain/ai/agent.types'
import { advanceAgentRun } from '@/domain/ai/mock-agent'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'

interface AgentTraceProps {
  run: AgentRun
  onComplete?: (run: AgentRun) => void
  onAwaitingApproval?: (run: AgentRun) => void
}

export function AgentTrace ({ run, onComplete, onAwaitingApproval }: AgentTraceProps) {
  const [currentRun, setCurrentRun] = useState(run)
  const [activeStep, setActiveStep] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    if (activeStep >= run.steps.length || completedRef.current) return

    const timer = setTimeout(() => {
      setCurrentRun((prev) => {
        const advanced = advanceAgentRun(prev, activeStep + 1)

        if (advanced.status === 'awaiting_approval') {
          onAwaitingApproval?.(advanced)
          completedRef.current = true
        } else if (advanced.status === 'complete') {
          onComplete?.(advanced)
          completedRef.current = true
        }

        return advanced
      })
      setActiveStep((prev) => prev + 1)
    }, 800)

    return () => clearTimeout(timer)
  }, [activeStep, run.steps.length, onComplete, onAwaitingApproval])

  return (
    <div className="rounded-lg border border-phb-yellow/25 bg-[#FFFCF0] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
        Agent trace · {currentRun.trigger}
      </p>
      <ol className="space-y-3">
        {currentRun.steps.map((step) => (
          <li key={step.id} className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              {step.status === 'complete' && (
                <CheckCircle2 className="size-4 text-success" aria-hidden />
              )}
              {step.status === 'running' && (
                <Loader2 className="size-4 animate-spin text-phb-yellow-dark" aria-hidden />
              )}
              {step.status === 'pending' && (
                <Circle className="size-4 text-text-tertiary" aria-hidden />
              )}
              <span
                className={cn(
                  step.status === 'complete' && 'text-text-secondary',
                  step.status === 'running' && 'font-medium text-text-primary',
                  step.status === 'pending' && 'text-text-tertiary'
                )}
              >
                {step.label}
              </span>
            </div>
            {step.toolCalls && step.toolCalls.length > 0 && (
              <ul className="ml-6 space-y-0.5">
                {step.toolCalls.map((tc) => (
                  <li
                    key={tc.id}
                    className="font-mono text-xs text-text-tertiary"
                  >
                    {tc.status === 'complete' ? '✓' : tc.status === 'running' ? '…' : '○'}{' '}
                    {tc.tool}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
