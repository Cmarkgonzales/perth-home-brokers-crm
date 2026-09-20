import type { Communication } from '@/domain/communications/communication.types'

export const demoCommunications: Communication[] = [
  {
    id: 'comm-001',
    clientId: 'client-001',
    dealId: 'PHB-2026-00142',
    channel: 'email',
    date: '2026-03-18',
    subject: 'Bank statement reminder',
    summary:
      'Sent reminder to Sarah & James to upload latest bank statement for finance application.',
    direction: 'outbound',
  },
  {
    id: 'comm-002',
    clientId: 'client-001',
    dealId: 'PHB-2026-00142',
    channel: 'call',
    date: '2026-03-17',
    subject: 'Finance consultation follow-up',
    summary:
      '15-minute call confirming budget, deposit amount, and Alkimos location preference.',
    direction: 'outbound',
  },
  {
    id: 'comm-003',
    clientId: 'client-001',
    dealId: 'PHB-2026-00142',
    channel: 'sms',
    date: '2026-03-16',
    subject: 'Document upload link',
    summary: 'SMS with secure upload link for payslips and ID documents.',
    direction: 'outbound',
  },
  {
    id: 'comm-004',
    clientId: 'client-001',
    dealId: 'PHB-2026-00142',
    channel: 'email',
    date: '2026-03-15',
    subject: 'Re: Initial consultation',
    summary:
      'Sarah confirmed availability for finance assessment and asked about The Horizon design.',
    direction: 'inbound',
  },
  {
    id: 'comm-005',
    clientId: 'client-002',
    dealId: 'PHB-2026-00138',
    channel: 'email',
    date: '2026-03-14',
    subject: 'Builder quote received',
    summary:
      'Forwarded Summit Homes quote to Michael for review. Noted budget variance.',
    direction: 'outbound',
  },
  {
    id: 'comm-006',
    clientId: 'client-003',
    channel: 'call',
    date: '2026-03-05',
    subject: 'Open home follow-up',
    summary:
      'Left voicemail for Daniel Smith regarding investment property consultation.',
    direction: 'outbound',
  },
]
