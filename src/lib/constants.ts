import type { DealStage } from '@/types/crm'
import type { LucideIcon } from 'lucide-react'
import {
  CheckCircle2,
  FileText,
  Handshake,
  LayoutDashboard,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'

export const APP_NAME = 'PHB Command Center'

export const NAV_ITEMS: {
  href: string
  label: string
  icon: LucideIcon
}[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: UserPlus },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/deals', label: 'Deals', icon: Handshake },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle2 },
]

export const AI_NAV_ITEM = {
  href: '/ai',
  label: 'AI Copilot',
  icon: Sparkles,
} as const

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  finance: 'Finance',
  land: 'Land',
  builder: 'Builder',
  package: 'Package',
  drafting: 'Drafting',
  approval: 'Approval',
  construction: 'Construction',
  settlement: 'Settlement',
}

export const DEMO_DEAL_ID = 'PHB-2026-00142'

export const CURRENT_USER = {
  name: 'Nathan Jones',
  initials: 'NJ',
  role: 'Broker',
} as const
