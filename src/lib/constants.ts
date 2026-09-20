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

export const APP_NAME = 'Command Center'

export const ORG_NAME = 'Perth Home Brokers'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  stub?: boolean
}

export interface NavSection {
  id: 'overview' | 'pipeline' | 'operations'
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    items: [
      { href: '/leads', label: 'Leads', icon: UserPlus },
      { href: '/clients', label: 'Clients', icon: Users },
      { href: '/deals', label: 'Deals', icon: Handshake },
      { href: '/packages', label: 'Packages', icon: Package },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { href: '/documents', label: 'Documents', icon: FileText },
      { href: '/approvals', label: 'Approvals', icon: CheckCircle2 },
      { href: '/commissions', label: 'Commissions', icon: Coins },
      { href: '/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
]

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items)

export const SETTINGS_NAV_ITEM = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
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

/** Canonical "today" for demo records dated in March 2026. */
export const DEMO_TODAY = '2026-03-20'

export const CURRENT_USER = {
  name: 'Nitesh Jha',
  initials: 'NJ',
  role: 'Broker',
  organisation: ORG_NAME,
} as const
