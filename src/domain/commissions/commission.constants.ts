import type { CommissionStatus } from '@/domain/commissions/commission.types'

export const COMMISSION_STATUS_LABEL: Record<CommissionStatus, string> = {
  pipeline: 'Pipeline',
  expected: 'Expected',
  paid: 'Paid',
}

export const COMMISSION_STATUS_CLASS: Record<CommissionStatus, string> = {
  pipeline: 'bg-surface-strong text-text-secondary',
  expected: 'bg-info/10 text-info',
  paid: 'bg-success/10 text-success',
}

const CONSULTANT_AVATAR_CLASS: Record<string, string> = {
  James: 'bg-surface-strong text-text-primary',
  Arvin: 'bg-info/10 text-info',
  Jay: 'bg-success/10 text-success',
  Sarah: 'bg-warning/10 text-warning',
}

export function getConsultantAvatarClass (name: string): string {
  return CONSULTANT_AVATAR_CLASS[name] ?? 'bg-surface-strong text-text-primary'
}
