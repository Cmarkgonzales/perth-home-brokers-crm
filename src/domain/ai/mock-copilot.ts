import { DEMO_DEAL_ID } from '@/lib/constants'
import { matchResponseKey } from '@/data/demo/ai-responses'
import type {
  AiBriefing,
  AiMessage,
  ApprovalAiSummary,
  DealAiInsight,
  DocumentCheckResult,
  LeadAssessment,
} from '@/domain/ai/ai.types'

let messageCounter = 0

function nextId (): string {
  messageCounter += 1
  return `msg-${String(messageCounter).padStart(3, '0')}`
}

export function getBriefing (): AiBriefing {
  return {
    headline: '7 deals require attention',
    items: [
      {
        text: '2 critical — Michael Chen approval overdue, Williams finance docs incomplete',
        severity: 'critical',
      },
      {
        text: '3 finance applications waiting on lender response',
        severity: 'warning',
      },
      {
        text: '2 clients have missing documents',
        severity: 'warning',
      },
      {
        text: '1 approval waiting 3+ days',
        severity: 'critical',
      },
    ],
  }
}

export function assessLead (leadId: string): LeadAssessment | null {
  if (leadId === 'lead-001') {
    return {
      leadId,
      leadName: 'Sarah & James Williams',
      intent: 'HIGH',
      estimatedBudget: 650000,
      timeline: '3–6 months',
      financeRisk: 'Medium',
      summary:
        'Sarah appears ready to proceed but has not completed her finance assessment. Strong first-home buyer profile with deposit saved.',
      recommendedAction: 'Schedule finance consultation',
    }
  }
  if (leadId === 'lead-002') {
    return {
      leadId,
      leadName: 'Michael Chen',
      intent: 'HIGH',
      estimatedBudget: 720000,
      timeline: '1–3 months',
      financeRisk: 'Low',
      summary:
        'Referral lead with pre-approved finance. Package selection in progress — builder quote pending approval.',
      recommendedAction: 'Follow up on builder quote approval',
    }
  }
  return {
    leadId,
    leadName: 'Unknown lead',
    intent: 'MEDIUM',
    estimatedBudget: 550000,
    timeline: '6+ months',
    financeRisk: 'Medium',
    summary: 'Limited information available. Recommend initial consultation.',
    recommendedAction: 'Schedule discovery call',
  }
}

export function checkDocument (documentId: string): DocumentCheckResult | null {
  if (documentId === 'doc-004') {
    return {
      documentId,
      documentName: 'James Williams Payslip',
      status: 'review',
      extractedFields: [
        { label: 'Name', value: 'James Williams' },
        { label: 'Employer', value: 'ABC Construction Pty Ltd' },
        { label: 'Pay period', value: 'Feb 2026' },
      ],
      issue:
        'Employer name differs from finance application (ABC Construction vs ABC Construction Group). Needs manual review.',
    }
  }
  if (documentId === 'doc-005') {
    return {
      documentId,
      documentName: 'Bank Statement',
      status: 'mismatch',
      extractedFields: [],
      issue: 'Document not uploaded. Required for finance approval.',
    }
  }
  return null
}

export function getApprovalAiSummary (approvalId: string): ApprovalAiSummary | null {
  if (approvalId === 'appr-001') {
    return {
      approvalId,
      summary:
        'Finance application is within client stated budget. All required identity documents present. Bank statement outstanding.',
      budgetFit: true,
      missingDocuments: ['Bank Statement'],
    }
  }
  if (approvalId === 'appr-002') {
    return {
      approvalId,
      summary:
        'Builder quote is within client stated budget ($720k). Plans and deposit receipt attached. No missing required documents detected.',
      budgetFit: true,
      missingDocuments: [],
    }
  }
  return null
}

export function getDealInsight (dealId: string): DealAiInsight | null {
  if (dealId === DEMO_DEAL_ID) {
    return {
      dealId,
      insight:
        'Client is ready for finance review. Bank statement is missing — request before lender submission.',
      nextActions: [
        'Request bank statement from Sarah',
        'Assign review task to Zoe',
        'Follow up tomorrow if not received',
      ],
    }
  }
  return null
}

export function generateResponse (prompt: string): AiMessage {
  const key = matchResponseKey(prompt)
  const timestamp = new Date().toISOString()

  const responses: Record<string, Omit<AiMessage, 'id' | 'timestamp'>> = {
    attention: {
      role: 'assistant',
      content: 'I found 7 deals requiring attention today.',
      sections: [
        {
          title: 'Critical (2)',
          severity: 'critical',
          items: [
            'Michael Chen — builder quote approval overdue 3 days',
            'Sarah Williams — finance documents incomplete (bank statement missing)',
          ],
        },
        {
          title: 'Follow-up needed (5)',
          severity: 'warning',
          items: [
            'Daniel Smith — no contact in 13 days',
            'Patel Family Build — house design confirmation pending',
            'Thompson Land — contract review due next week',
          ],
        },
      ],
      links: [
        { label: 'View 7 deals', href: '/deals' },
        { label: 'Review Williams deal', href: `/deals/${DEMO_DEAL_ID}` },
        { label: 'Review Chen approval', href: '/approvals/appr-002' },
      ],
    },
    sarah_deal: {
      role: 'assistant',
      content: 'Summary for Williams Family Home (PHB-2026-00142):',
      sections: [
        {
          title: 'Current state',
          items: [
            'Stage: Finance Approval (68% complete)',
            'Client: Sarah & James Williams — First Home Buyer, Alkimos',
            'Deal value: $642,000',
            'Owner: James',
          ],
        },
        {
          title: 'Blockers',
          severity: 'critical',
          items: ['Bank statement missing — blocks lender submission'],
        },
        {
          title: 'Recommended next steps',
          items: [
            'Request bank statement from Sarah',
            'Complete finance document review',
            'Submit to lender once complete',
          ],
        },
      ],
      links: [
        { label: 'Open deal workspace', href: `/deals/${DEMO_DEAL_ID}` },
        { label: 'View documents', href: '/documents?deal=PHB-2026-00142' },
      ],
    },
    leads: {
      role: 'assistant',
      content: '3 leads have not been contacted in the last 7 days:',
      sections: [
        {
          title: 'Inactive leads',
          severity: 'warning',
          items: [
            'Daniel Smith — Facebook, $550k, last contact 13 days ago',
            'Emma & Tom Roberts — Referral, $680k, last contact 9 days ago',
          ],
        },
      ],
      links: [
        { label: 'View leads', href: '/leads' },
        { label: 'Contact Daniel Smith', href: '/clients/client-003' },
      ],
    },
    briefing: {
      role: 'assistant',
      content: 'Good morning. Here is your PHB business briefing:',
      sections: [
        {
          title: 'Pipeline snapshot',
          items: [
            '7 active deals across finance, package, and construction',
            'Pipeline value: $4.2M',
            '2 deals at critical risk',
          ],
        },
        {
          title: 'Top priorities',
          severity: 'critical',
          items: [
            '1. Review Michael Chen builder quote approval (3 days overdue)',
            '2. Request bank statement from Sarah Williams',
            '3. Follow up with 3 inactive leads',
          ],
        },
      ],
      links: [
        { label: 'View dashboard', href: '/dashboard' },
        { label: 'Open AI activity', href: '/ai/activity' },
      ],
    },
    michael_followup: {
      role: 'assistant',
      content:
        'I have drafted a follow-up for Michael Chen regarding the overdue builder quote approval.',
      sections: [
        {
          title: 'Draft message',
          items: [
            'Hi Michael, I wanted to follow up on the builder quote for your Baldivis package. Our admin team is reviewing the approval and I expect an update within 24 hours. Please let me know if you have any questions.',
          ],
        },
      ],
      links: [
        { label: 'Review approval', href: '/approvals/appr-002' },
      ],
    },
    sarah_next: {
      role: 'assistant',
      content: 'Recommended next actions for Sarah Williams\' deal:',
      sections: [
        {
          title: 'Immediate actions',
          items: [
            'Request bank statement — assign to Zoe, due today',
            'Review uploaded payslips for consistency',
            'Prepare lender submission once documents complete',
          ],
        },
      ],
      links: [
        { label: 'Open deal', href: `/deals/${DEMO_DEAL_ID}` },
        { label: 'View documents', href: '/documents?deal=PHB-2026-00142' },
      ],
    },
    default: {
      role: 'assistant',
      content:
        'I can help with deal summaries, pipeline priorities, lead follow-ups, and document checks. Try one of the suggested prompts or ask about a specific client or deal.',
    },
  }

  const response = responses[key] ?? responses.default

  return {
    id: nextId(),
    timestamp,
    ...response,
  }
}

export function createUserMessage (content: string): AiMessage {
  return {
    id: nextId(),
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  }
}
