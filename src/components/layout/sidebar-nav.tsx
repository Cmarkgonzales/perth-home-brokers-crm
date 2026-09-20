'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { BrandMark } from '@/components/layout/brand-mark'
import { cn } from '@/lib/utils'
import {
  AI_NAV_ITEM,
  NAV_SECTIONS,
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
  icon: LucideIcon
  isActive: boolean
  badge?: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:py-2',
        isActive
          ? 'bg-surface-strong pl-[calc(0.75rem-3px)] text-text-primary'
          : 'text-sidebar-text hover:bg-surface-muted hover:text-text-primary'
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

export function SidebarBrand ({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-14 shrink-0 items-center border-b border-border px-4',
        className
      )}
    >
      <BrandMark />
    </div>
  )
}

export function SidebarNav () {
  const pathname = usePathname()
  const SettingsIcon = SETTINGS_NAV_ITEM.icon
  const AiIcon = AI_NAV_ITEM.icon

  return (
    <nav className="flex flex-1 flex-col overflow-y-auto p-3">
      <div className="flex flex-col gap-4">
        {NAV_SECTIONS.map((section) => {
          const headingId = `nav-${section.id}`

          return (
            <section key={section.id} aria-labelledby={headingId}>
              <h2
                id={headingId}
                className="px-3 pb-1 text-[11px] font-medium tracking-wide text-text-tertiary uppercase"
              >
                {section.label}
              </h2>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActiveRoute(pathname, item.href)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <div className="my-3 border-t border-sidebar-border" />

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
  )
}
