import { getDashboardSnapshot } from '@/data/demo/dashboard'
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
import type { Lead } from '@/domain/leads/lead.types'
import { formatCurrency } from '@/lib/formatting'

let messageCounter = 0

function nextId (): string {
  messageCounter += 1
  return `msg-${String(messageCounter).padStart(3, '0')}`
}

export function getBriefing (): AiBriefing {
  const snapshot = getDashboardSnapshot()
  const { briefing } = snapshot

  return {
    headline: briefing.headline,
    overdueApprovals: briefing.overdueApprovals,
    missingDocuments: briefing.missingDocuments,
    criticalCount: briefing.criticalCount,
    prompt: briefing.prompt,
    items: [
      {
        text: `${briefing.overdueApprovals} approvals overdue`,
        severity: 'critical',
      },
      {
        text: `${briefing.missingDocuments} documents missing`,
        severity: 'warning',
      },
      {
        text: `${briefing.criticalCount} critical`,
        severity: 'critical',
      },
    ],
  }
}

const LEAD_ASSESSMENT_OVERRIDES: Record<
  string,
  Omit<LeadAssessment, 'leadId' | 'leadName' | 'estimatedBudget'>
> = {
  'lead-001': {
    intent: 'High',
    timeline: '3–6 months',
    financeRisk: 'Medium',
    summary:
      'Converted first-home buyers with a saved deposit. Sarah appears ready to proceed, but the finance assessment is still outstanding before land selection can lock in.',
    recommendedAction:
      'Email Sarah the finance document checklist and book a 20-minute consultation.',
    recommendedChannel: 'email',
  },
  'lead-002': {
    intent: 'High',
    timeline: '1–3 months',
    financeRisk: 'Low',
    summary:
      'Referral lead with strong intent and pre-approved finance. Package selection is underway — the builder quote is the remaining blocker.',
    recommendedAction: 'Call Michael to confirm the builder quote review.',
    recommendedChannel: 'call',
  },
  'lead-003': {
    intent: 'Medium',
    timeline: '6–12 months',
    financeRisk: 'Medium',
    summary:
      'Responded to a Facebook ad and has not been contacted since. The budget is at the upper end of outer-metro house-and-land packages, but employment and deposit details are missing.',
    recommendedAction:
      'Call today and book a 20-minute finance consultation.',
    recommendedChannel: 'call',
  },
  'lead-004': {
    intent: 'Medium',
    timeline: '6–12 months',
    financeRisk: 'Medium',
    summary:
      'Visited an open home and has not had a consult booked. The budget is realistic for the outer southern suburbs, but employment and deposit details are missing.',
    recommendedAction:
      'Call today and book a 20-minute finance consultation.',
    recommendedChannel: 'call',
  },
  'lead-005': {
    intent: 'Medium',
    timeline: '3–6 months',
    financeRisk: 'Medium',
    summary:
      'Website enquiry with a workable budget. No consult has been booked and first-home-buyer eligibility has not been confirmed.',
    recommendedAction: 'SMS Liam a booking link for a discovery call.',
    recommendedChannel: 'sms',
  },
  'lead-006': {
    intent: 'Medium',
    timeline: '6–12 months',
    financeRisk: 'Low',
    summary:
      'Referral enquiry that has not been qualified. Timeline is flexible; confirm deposit position before offering a land shortlist.',
    recommendedAction: 'Email Jack a short qualification questionnaire.',
    recommendedChannel: 'email',
  },
}

function fallbackAssessment (
  lead: Lead
): Omit<LeadAssessment, 'leadId' | 'leadName' | 'estimatedBudget'> {
  if (lead.status === 'Lost') {
    return {
      intent: 'Low',
      timeline: 'Unknown',
      financeRisk: 'High',
      summary:
        'This enquiry is marked lost. Review the last contact notes before any further outreach.',
      recommendedAction: 'Call to confirm whether the enquiry should be reopened.',
      recommendedChannel: 'call',
    }
  }

  if (lead.status === 'Qualified' || lead.status === 'Converted') {
    return {
      intent: 'High',
      timeline: '1–3 months',
      financeRisk: 'Low',
      summary: `${lead.name} is ${lead.status.toLowerCase()} from ${lead.source}. Finance and package next steps should stay with ${lead.owner}.`,
      recommendedAction: `Email ${lead.name} a confirmation of the next qualification step.`,
      recommendedChannel: 'email',
    }
  }

  return {
    intent: 'Medium',
    timeline: '6–12 months',
    financeRisk: 'Medium',
    summary: `Limited qualification notes from ${lead.source}. The stated budget is ${formatCurrency(lead.budget)}, but employment and deposit details are missing.`,
    recommendedAction:
      'Call today and book a 20-minute finance consultation.',
    recommendedChannel: 'call',
  }
}

export function assessLead (lead: Lead): LeadAssessment {
  const details = LEAD_ASSESSMENT_OVERRIDES[lead.id] ?? fallbackAssessment(lead)

  return {
    leadId: lead.id,
    leadName: lead.name,
    estimatedBudget: lead.budget,
    ...details,
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
        { label: 'Employer', value: 'ABC Construction' },
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
        'Sarah and James are 68% through the deal and waiting on finance approval. 3 of 6 documents are verified; the bank statement and the finance declaration are still missing. James\'s payslip has a possible employer name mismatch.',
      suggestedNextStep: 'finance documents need review',
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
        { label: 'View documents', href: `/documents/${DEMO_DEAL_ID}` },
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
        { label: 'View documents', href: `/documents/${DEMO_DEAL_ID}` },
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
