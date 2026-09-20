'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferenceKey,
  type NotificationPreferences,
} from '@/domain/settings/notification-preferences'

const STORAGE_KEY = 'phb-notification-preferences'
const CHANGE_EVENT = 'phb-notification-preferences-changed'

function isPreferences (value: unknown): value is NotificationPreferences {
  if (!value || typeof value !== 'object') return false

  const record = value as Record<string, unknown>
  return (
    typeof record.overdueApprovals === 'boolean' &&
    typeof record.documentsReceived === 'boolean' &&
    typeof record.morningBriefing === 'boolean'
  )
}

function parsePreferences (raw: string | null): NotificationPreferences {
  if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isPreferences(parsed)) return DEFAULT_NOTIFICATION_PREFERENCES
    return parsed
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES
  }
}

let cachedRaw: string | null | undefined
let cachedPreferences: NotificationPreferences = DEFAULT_NOTIFICATION_PREFERENCES

function getPreferencesSnapshot (): NotificationPreferences {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedPreferences
  cachedRaw = raw
  cachedPreferences = parsePreferences(raw)
  return cachedPreferences
}

function subscribeToPreferences (onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange)
  window.addEventListener(CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStoreChange)
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
  }
}

function persistPreferences (preferences: NotificationPreferences) {
  const raw = JSON.stringify(preferences)
  localStorage.setItem(STORAGE_KEY, raw)
  cachedRaw = raw
  cachedPreferences = preferences
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function useNotificationPreferences () {
  const preferences = useSyncExternalStore(
    subscribeToPreferences,
    getPreferencesSnapshot,
    (): NotificationPreferences => DEFAULT_NOTIFICATION_PREFERENCES
  )

  const setPreference = useCallback(
    (key: NotificationPreferenceKey, enabled: boolean) => {
      persistPreferences({ ...getPreferencesSnapshot(), [key]: enabled })
    },
    []
  )

  return { preferences, setPreference }
}
