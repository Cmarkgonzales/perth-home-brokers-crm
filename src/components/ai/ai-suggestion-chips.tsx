import type { AiSuggestion } from '@/domain/ai/ai.types'
import { Sparkles } from 'lucide-react'

interface AiSuggestionChipsProps {
  suggestions: AiSuggestion[]
  onSelect: (prompt: string) => void
}

export function AiSuggestionChips ({ suggestions, onSelect }: AiSuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          type="button"
          onClick={() => onSelect(suggestion.prompt)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-phb-yellow/40 bg-white px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-[#FFF9E5]"
        >
          <Sparkles className="size-3 text-phb-yellow-dark" aria-hidden />
          {suggestion.label}
        </button>
      ))}
    </div>
  )
}
