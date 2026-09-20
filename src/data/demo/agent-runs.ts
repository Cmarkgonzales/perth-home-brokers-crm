import type { AgentRunRecord } from '@/domain/ai/agent.types'

export const demoAgentRuns: AgentRunRecord[] = [
  {
    id: 'record-001',
    trigger: 'Prepare my morning briefing',
    timestamp: '2026-09-20T08:00:00.000Z',
    toolsUsed: [
      'get_pipeline()',
      'get_overdue_tasks()',
      'get_stale_deals()',
      'get_pending_approvals()',
      'get_missing_documents()',
    ],
    outcome: 'Generated prioritized briefing — 7 deals need attention',
    humanApproved: false,
  },
  {
    id: 'record-002',
    trigger: 'Draft follow-up for Michael Chen approval',
    timestamp: '2026-09-19T14:30:00.000Z',
    toolsUsed: ['get_deal()', 'get_pending_approvals()', 'draft_message()'],
    outcome: 'Follow-up message sent via email after human approval',
    humanApproved: true,
  },
  {
    id: 'record-003',
    trigger: 'AI qualify lead: Sarah Williams',
    timestamp: '2026-09-18T10:15:00.000Z',
    toolsUsed: ['get_lead()', 'get_documents()'],
    outcome: 'Recommended: Schedule finance consultation',
    humanApproved: false,
  },
  {
    id: 'record-004',
    trigger: 'Process document: James Williams Payslip',
    timestamp: '2026-09-17T16:45:00.000Z',
    toolsUsed: ['extract_document()', 'validate_document()'],
    outcome: 'Flagged employer name mismatch — manual review required',
    humanApproved: false,
  },
]
