import type { AiSuggestion } from '@/domain/ai/ai.types'

export const AI_SUGGESTIONS: AiSuggestion[] = [
  {
    id: 'sug-001',
    label: 'Which deals need attention today?',
    prompt: 'Which deals need attention today?',
  },
  {
    id: 'sug-002',
    label: "Summarize Sarah's deal",
    prompt: "Summarize Sarah Williams' deal",
  },
  {
    id: 'sug-003',
    label: "Leads that haven't been contacted",
    prompt: "Which leads haven't been contacted?",
  },
  {
    id: 'sug-004',
    label: 'Prepare my morning briefing',
    prompt: 'Prepare my morning briefing',
  },
  {
    id: 'sug-005',
    label: "Draft follow-up for Michael's approval",
    prompt: "Draft a follow-up for Michael Chen's overdue approval",
  },
]

export const AI_RESPONSE_PATTERNS: {
  pattern: RegExp
  responseKey: string
}[] = [
  { pattern: /attention|focus|priorit/i, responseKey: 'attention' },
  { pattern: /sarah|williams/i, responseKey: 'sarah_deal' },
  { pattern: /lead|contact/i, responseKey: 'leads' },
  { pattern: /briefing|morning/i, responseKey: 'briefing' },
  { pattern: /michael|follow.?up|approval/i, responseKey: 'michael_followup' },
  { pattern: /next.*sarah|sarah.*next/i, responseKey: 'sarah_next' },
]

export function matchResponseKey (prompt: string): string {
  for (const { pattern, responseKey } of AI_RESPONSE_PATTERNS) {
    if (pattern.test(prompt)) return responseKey
  }
  return 'default'
}
