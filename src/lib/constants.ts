import type { DealStage } from '@/domain/deals/deal.types'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  CheckCircle2,
  Coins,
  FileText,
  Handshake,
  LayoutDashboard,
  Package,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'

export const APP_NAME = 'PHB Command Center'

export const NAV_ITEMS: {
  href: string
  label: string
  icon: LucideIcon
  stub?: boolean
}[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: UserPlus },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/deals', label: 'Deals', icon: Handshake },
  { href: '/packages', label: 'Packages', icon: Package, stub: true },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: CheckCircle2 },
  { href: '/commissions', label: 'Commissions', icon: Coins, stub: true },
  { href: '/reports', label: 'Reports', icon: BarChart3, stub: true },
]

export const SETTINGS_NAV_ITEM = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
  stub: true,
} as const

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
  name: 'Nitesh Jha',
  initials: 'NJ',
  role: 'Broker',
} as const
