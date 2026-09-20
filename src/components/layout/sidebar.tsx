'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  AI_NAV_ITEM,
  NAV_ITEMS,
  SETTINGS_NAV_ITEM,
} from '@/lib/constants'

function isActiveRoute (pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink ({
  href,
  label,
  icon: Icon,
  isActive,
  badge,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  badge?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-l-[3px] border-phb-red bg-surface-strong pl-[calc(0.75rem-3px)] text-text-primary'
          : 'border-l-[3px] border-transparent text-sidebar-text hover:bg-surface-muted hover:text-text-primary'
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          isActive ? 'text-text-primary' : 'text-sidebar-muted'
        )}
      />
      {label}
      {badge}
    </Link>
  )
}

export function Sidebar () {
  const pathname = usePathname()
  const SettingsIcon = SETTINGS_NAV_ITEM.icon
  const AiIcon = AI_NAV_ITEM.icon

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-surface">
      <div className="border-b border-sidebar-border px-4 py-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-phb-red uppercase">
          Perth Home Brokers
        </p>
        <p className="mt-1 text-sm font-semibold text-text-primary">
          Command Center
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={isActiveRoute(pathname, item.href)}
          />
        ))}

        <div className="my-2 border-t border-sidebar-border" />

        <NavLink
          href={AI_NAV_ITEM.href}
          label={AI_NAV_ITEM.label}
          icon={AiIcon}
          isActive={isActiveRoute(pathname, AI_NAV_ITEM.href)}
          badge={
            <span aria-hidden className="ml-auto text-xs text-phb-yellow">
              ✦
            </span>
          }
        />

        <NavLink
          href={SETTINGS_NAV_ITEM.href}
          label={SETTINGS_NAV_ITEM.label}
          icon={SettingsIcon}
          isActive={isActiveRoute(pathname, SETTINGS_NAV_ITEM.href)}
        />
      </nav>
    </aside>
  )
}
