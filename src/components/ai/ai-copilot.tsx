'use client'

import { useMemo, useState } from 'react'
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
  onAgentPrompt?: (prompt: string) => void
}

export function AiCopilot ({
  initialMessages = [],
  appendedMessages = [],
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

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[480px] flex-col rounded-xl border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
        <span className="text-sm font-semibold text-text-primary">PHB AI Copilot</span>
        <span className="text-xs text-text-tertiary">Demo · mock responses</span>
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
          className="flex gap-2"
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
            disabled={!input.trim() || isThinking}
            className="shrink-0 bg-phb-yellow text-text-primary hover:bg-phb-yellow-dark"
          >
            <Send className="size-4" aria-hidden />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
