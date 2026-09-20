'use client'

import { useId, useRef } from 'react'
import { useTheme, type ThemePreference } from '@/components/layout/theme-provider'
import { useNotificationPreferences } from '@/components/settings/use-notification-preferences'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { NOTIFICATION_PREFERENCE_ITEMS } from '@/domain/settings/notification-preferences'

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

function SettingsCard ({
  title,
  children,
  contentClassName,
}: {
  title: string
  children: React.ReactNode
  contentClassName?: string
}) {
  const headingId = useId()

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-5">
        <CardTitle id={headingId} className="font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('px-5 py-5', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}

function AppearanceSettings () {
  const { preference, setTheme } = useTheme()
  const groupId = useId()
  const buttonsRef = useRef(new Map<ThemePreference, HTMLButtonElement>())

  function selectPreference (next: ThemePreference) {
    setTheme(next)
    buttonsRef.current.get(next)?.focus()
  }

  function handleGroupKeyDown (event: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = THEME_OPTIONS.findIndex(
      (option) => option.value === preference
    )
    if (currentIndex === -1) return

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length]
      selectPreference(next.value)
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next =
        THEME_OPTIONS[
          (currentIndex - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length
        ]
      selectPreference(next.value)
    }
  }

  return (
    <SettingsCard title="Appearance">
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px]"
        onKeyDown={handleGroupKeyDown}
      >
        <span id={groupId} className="sr-only">
          Colour theme
        </span>
        {THEME_OPTIONS.map((option) => {
          const isSelected = preference === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              ref={(node) => {
                if (node) {
                  buttonsRef.current.set(option.value, node)
                } else {
                  buttonsRef.current.delete(option.value)
                }
              }}
              className={cn(
                'inline-flex h-full cursor-pointer items-center rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                isSelected
                  ? 'bg-background text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
              onClick={() => selectPreference(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </SettingsCard>
  )
}

function NotificationSettings () {
  const { preferences, setPreference } = useNotificationPreferences()

  return (
    <SettingsCard title="Notifications" contentClassName="px-0 py-0">
      <div className="divide-y divide-border">
        {NOTIFICATION_PREFERENCE_ITEMS.map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-primary">
                {item.title}
              </span>
              <span className="mt-0.5 block text-sm text-text-secondary">
                {item.description}
              </span>
            </span>
            <Switch
              checked={preferences[item.key]}
              onCheckedChange={(checked) => setPreference(item.key, checked)}
            />
          </label>
        ))}
      </div>
    </SettingsCard>
  )
}

export function SettingsWorkspace () {
  return (
    <div className="max-w-2xl space-y-4">
      <AppearanceSettings />
      <NotificationSettings />
    </div>
  )
}
