'use client'

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  createContext,
} from 'react'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

const STORAGE_KEY = 'phb-theme'
const PREFERENCE_ATTR = 'data-theme-preference'

interface ThemeContextValue {
  theme: Theme
  preference: ThemePreference
  toggleTheme: () => void
  setTheme: (theme: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemePreference (value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getSystemTheme (): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getThemeSnapshot (): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function getPreferenceSnapshot (): ThemePreference {
  const value = document.documentElement.getAttribute(PREFERENCE_ATTR)
  return isThemePreference(value) ? value : 'light'
}

function subscribeToTheme (onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', PREFERENCE_ATTR],
  })
  return () => observer.disconnect()
}

function resolveTheme (preference: ThemePreference): Theme {
  return preference === 'system' ? getSystemTheme() : preference
}

function applyTheme (preference: ThemePreference) {
  const resolved = resolveTheme(preference)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.setAttribute(PREFERENCE_ATTR, preference)
  localStorage.setItem(STORAGE_KEY, preference)
}

export function ThemeProvider ({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getThemeSnapshot,
    (): Theme => 'light'
  )
  const preference = useSyncExternalStore<ThemePreference>(
    subscribeToTheme,
    getPreferenceSnapshot,
    (): ThemePreference => 'light'
  )

  const setTheme = useCallback((next: ThemePreference) => {
    applyTheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function syncSystemTheme () {
      if (getPreferenceSnapshot() === 'system') {
        applyTheme('system')
      }
    }

    media.addEventListener('change', syncSystemTheme)
    return () => media.removeEventListener('change', syncSystemTheme)
  }, [])

  const value = useMemo(
    () => ({ theme, preference, toggleTheme, setTheme }),
    [theme, preference, toggleTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme () {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}

export const themeInitScript = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'&&t!=='system')t='light';document.documentElement.setAttribute('${PREFERENCE_ATTR}',t);if(t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`
