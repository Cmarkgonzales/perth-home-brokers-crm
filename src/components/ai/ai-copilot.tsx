'use client'

import { useEffect, useMemo, useState } from 'react'
import type { AiMessage } from '@/domain/ai/ai.types'
import { AI_SUGGESTIONS } from '@/data/demo/ai-responses'
import {
  createUserMessage,
  generateResponse,
} from '@/domain/ai/mock-copilot'
import { AiMessage as AiMessageComponent } from '@/components/ai/ai-message'
import { AiSuggestionChips } from '@/components/ai/ai-suggestion-chips'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, Send } from 'lucide-react'

interface AiCopilotProps {
  initialMessages?: AiMessage[]
  appendedMessages?: AiMessage[]
  initialPrompt?: string
  onAgentPrompt?: (prompt: string) => void
}

export function AiCopilot ({
  initialMessages = [],
  appendedMessages = [],
  initialPrompt,
  onAgentPrompt,
}: AiCopilotProps) {
  const [messages, setMessages] = useState<AiMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const displayMessages = useMemo(() => {
    const existingIds = new Set(messages.map((m) => m.id))
    const extra = appendedMessages.filter((m) => !existingIds.has(m.id))
    return [...messages, ...extra]
  }, [messages, appendedMessages])

  function handleSubmit (prompt: string) {
    if (!prompt.trim() || isThinking) return

    const userMessage = createUserMessage(prompt.trim())
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    if (onAgentPrompt) {
      onAgentPrompt(prompt.trim())
    }

    setTimeout(() => {
      const response = generateResponse(prompt.trim())
      setMessages((prev) => [...prev, response])
      setIsThinking(false)
    }, 600)
  }

  useEffect(() => {
    const prompt = initialPrompt?.trim()
    if (!prompt) return

    const startId = window.setTimeout(() => {
      setMessages((prev) => {
        if (prev.some((message) => message.role === 'user' && message.content === prompt)) {
          return prev
        }
        return [...prev, createUserMessage(prompt)]
      })
      setIsThinking(true)
      onAgentPrompt?.(prompt)
    }, 0)

    const doneId = window.setTimeout(() => {
      setMessages((prev) => {
        if (prev.some((message) => message.role === 'assistant')) return prev
        return [...prev, generateResponse(prompt)]
      })
      setIsThinking(false)
    }, 600)

    return () => {
      window.clearTimeout(startId)
      window.clearTimeout(doneId)
    }
  }, [initialPrompt]) // eslint-disable-line react-hooks/exhaustive-deps -- send dashboard CTA prompt once

  return (
    <div className="flex h-[calc(100svh-14rem)] min-h-[24rem] flex-col rounded-xl border border-border bg-surface sm:min-h-[480px] lg:h-[calc(100vh-12rem)]">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-border px-4 py-3">
        <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
        <span className="text-sm font-semibold text-text-primary">PHB AI Copilot</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {displayMessages.length === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Ask about your pipeline, deals, documents, or next actions. AI responses
              use demo CRM context — no live model connected.
            </p>
            <AiSuggestionChips
              suggestions={AI_SUGGESTIONS}
              onSelect={handleSubmit}
            />
          </div>
        )}

        {displayMessages.map((message) => (
          <AiMessageComponent key={message.id} message={message} />
        ))}

        {isThinking && (
          <p className="text-xs text-text-tertiary">✦ Reviewing CRM context…</p>
        )}
      </div>

      <div className="border-t border-border p-4">
        {displayMessages.length > 0 && (
          <div className="mb-3">
            <AiSuggestionChips
              suggestions={AI_SUGGESTIONS.slice(0, 3)}
              onSelect={handleSubmit}
            />
          </div>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit(input)
          }}
          className="flex items-stretch gap-2"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your business…"
            rows={2}
            className="min-h-[60px] resize-none"
          />
          <Button
            type="submit"
            variant="brand"
            disabled={!input.trim() || isThinking}
            className="h-auto min-h-[60px] self-stretch px-3.5"
          >
            <Send className="size-4" aria-hidden />
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
