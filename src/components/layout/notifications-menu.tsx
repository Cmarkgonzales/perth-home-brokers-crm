'use client'

import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { demoNotifications } from '@/data/demo/notifications'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const READ_STORAGE_KEY = 'phb-notifications-read'
const EMPTY_IDS: string[] = []

let cachedRaw: string | null | undefined
let cachedIds: string[] = EMPTY_IDS

function parseReadIds (raw: string | null): string[] {
  if (!raw) return EMPTY_IDS

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY_IDS
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return EMPTY_IDS
  }
}

function getReadIdsSnapshot (): string[] {
  const raw = sessionStorage.getItem(READ_STORAGE_KEY)
  if (raw === cachedRaw) return cachedIds
  cachedRaw = raw
  cachedIds = parseReadIds(raw)
  return cachedIds
}

function subscribeToStorage (onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener('phb-notifications-changed', onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener('phb-notifications-changed', onStoreChange)
  }
}

function persistReadIds (ids: string[]) {
  const uniqueIds = [...new Set(ids)]
  sessionStorage.setItem(READ_STORAGE_KEY, JSON.stringify(uniqueIds))
  cachedRaw = undefined
  window.dispatchEvent(new Event('phb-notifications-changed'))
}

export function clearNotificationReadState () {
  sessionStorage.removeItem(READ_STORAGE_KEY)
  cachedRaw = undefined
  window.dispatchEvent(new Event('phb-notifications-changed'))
}

export function NotificationsMenu () {
  const router = useRouter()
  const storedReadIds = useSyncExternalStore(
    subscribeToStorage,
    getReadIdsSnapshot,
    () => EMPTY_IDS
  )
  const readIds = new Set(storedReadIds)

  const notifications = demoNotifications.map((notification) => ({
    ...notification,
    read: notification.read || readIds.has(notification.id),
  }))
  const unreadCount = notifications.filter((notification) => !notification.read).length

  function markAllRead () {
    persistReadIds(demoNotifications.map((notification) => notification.id))
  }

  function openNotification (id: string, href: string) {
    persistReadIds([...readIds, id])
    router.push(href)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex size-8 cursor-pointer items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 size-2 rounded-full bg-phb-yellow ring-2 ring-surface"
            aria-hidden
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 min-w-80 p-0">
        <div className="flex items-center justify-between gap-3 px-3 py-2.5">
          <p className="text-sm font-semibold text-text-primary">
            Notifications
          </p>
          <button
            type="button"
            className="cursor-pointer text-xs font-medium text-text-secondary hover:text-text-primary disabled:cursor-not-allowed disabled:text-text-disabled"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
        <DropdownMenuSeparator className="my-0" />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="cursor-pointer items-start gap-2 rounded-none px-3 py-2.5"
            onClick={() => openNotification(notification.id, notification.href)}
          >
            <span
              className={cn(
                'mt-1.5 size-1.5 shrink-0 rounded-full',
                notification.read
                  ? 'bg-border-strong'
                  : notification.kind === 'ai'
                    ? 'bg-phb-yellow'
                    : 'bg-danger'
              )}
              aria-hidden
            />
            <span
              className={cn(
                'text-sm leading-snug whitespace-normal',
                notification.read
                  ? 'text-text-secondary'
                  : 'text-text-primary'
              )}
            >
              {notification.title}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
