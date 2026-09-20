import type { LeadAssessment, LeadFollowUpChannel } from '@/domain/ai/ai.types'
import type { Lead } from '@/domain/leads/lead.types'
import { getInitials } from '@/lib/formatting'

export const LEAD_FOLLOW_UP_CHANNELS = [
  'call',
  'sms',
  'email',
] as const satisfies readonly LeadFollowUpChannel[]

export const LEAD_FOLLOW_UP_CHANNEL_LABELS: Record<LeadFollowUpChannel, string> = {
  call: 'Call',
  sms: 'SMS',
  email: 'Email',
}

export function getLeadInitials (name: string): string {
  return getInitials(name)
}

export function getFollowUpTaskDraft (
  lead: Lead,
  assessment: LeadAssessment,
  channel: LeadFollowUpChannel
): { title: string; notes: string } {
  const firstName = lead.name.split(/[\s&]/).find(Boolean) ?? lead.name

  if (channel === 'call') {
    return {
      title: `Call ${lead.name}`,
      notes: `${assessment.recommendedAction} Confirm employment, deposit, and suburb preferences on the call.`,
    }
  }

  if (channel === 'sms') {
    return {
      title: `SMS ${lead.name}`,
      notes: `Hi ${firstName}, it's ${lead.owner} from Perth Home Brokers. ${assessment.recommendedAction} Reply here and I will lock in a time.`,
    }
  }

  const destination = lead.email ?? lead.name
  return {
    title: `Email ${lead.name}`,
    notes: `${assessment.recommendedAction} Send to ${destination}.`,
  }
}
