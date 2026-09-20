export type NotificationPreferenceKey =
  | 'overdueApprovals'
  | 'documentsReceived'
  | 'morningBriefing'

export interface NotificationPreferences {
  overdueApprovals: boolean
  documentsReceived: boolean
  morningBriefing: boolean
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  overdueApprovals: true,
  documentsReceived: true,
  morningBriefing: true,
}

export const NOTIFICATION_PREFERENCE_ITEMS: {
  key: NotificationPreferenceKey
  title: string
  description: string
}[] = [
  {
    key: 'overdueApprovals',
    title: 'Overdue approvals',
    description: 'Tell me when a request has waited two days.',
  },
  {
    key: 'documentsReceived',
    title: 'Documents received',
    description: 'Tell me when a client uploads a document.',
  },
  {
    key: 'morningBriefing',
    title: 'Morning briefing',
    description: 'Send the AI briefing at 8:00 am.',
  },
]
