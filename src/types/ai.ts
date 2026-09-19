export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AiSuggestion {
  id: string
  label: string
  prompt: string
}
