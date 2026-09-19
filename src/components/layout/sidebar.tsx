'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AI_NAV_ITEM, NAV_ITEMS } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

function isActiveRoute (pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Sidebar () {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = isActiveRoute(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <Separator className="my-2 bg-sidebar-border" />

        {(() => {
          const Icon = AI_NAV_ITEM.icon
          const isActive = isActiveRoute(pathname, AI_NAV_ITEM.href)

          return (
            <Link
              href={AI_NAV_ITEM.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {AI_NAV_ITEM.label}
              <span aria-hidden className="ml-auto text-xs">
                ✨
              </span>
            </Link>
          )
        })()}
      </nav>
    </aside>
  )
}
