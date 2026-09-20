import type { NotificationPreferenceKey } from '@/domain/settings/notification-preferences'

export type NotificationKind = 'alert' | 'ai'

export interface AppNotification {
  id: string
  title: string
  href: string
  kind: NotificationKind
  read: boolean
  preferenceKey: NotificationPreferenceKey
}

export const demoNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    title: "Michael Chen's builder quote approval is 3 days overdue",
    href: '/approvals/appr-002',
    kind: 'alert',
    read: false,
    preferenceKey: 'overdueApprovals',
  },
  {
    id: 'notif-002',
    title: "AI flagged James Williams's payslip for review",
    href: '/documents/PHB-2026-00142',
    kind: 'ai',
    read: false,
    preferenceKey: 'documentsReceived',
  },
  {
    id: 'notif-003',
    title: 'Your morning briefing is ready',
    href: '/ai',
    kind: 'ai',
    read: false,
    preferenceKey: 'morningBriefing',
  },
]
