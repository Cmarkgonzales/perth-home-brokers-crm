'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { searchCrmRecords } from '@/data/demo'
import {
  CRM_SEARCH_ENTITY_LABELS,
  type CrmSearchResult,
} from '@/domain/search/search-crm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CrmSearchProps {
  autoFocus?: boolean
  layout?: 'overlay' | 'inline'
  onNavigate?: () => void
}

export function CrmSearch ({
  autoFocus = false,
  layout = 'overlay',
  onNavigate,
}: CrmSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [indexForQuery, setIndexForQuery] = useState(query)
  const [pathForReset, setPathForReset] = useState(pathname)

  if (pathForReset !== pathname) {
    setPathForReset(pathname)
    setQuery('')
    setIsOpen(false)
    setActiveIndex(0)
    setIndexForQuery('')
  } else if (indexForQuery !== query) {
    setIndexForQuery(query)
    setActiveIndex(0)
  }

  const results = useMemo(() => searchCrmRecords(query), [query])
  const trimmedQuery = query.trim()
  const hasQuery = trimmedQuery.length > 0
  const showPanel = isOpen && hasQuery
  const activeResult = results[activeIndex]

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    function handlePointerDown (event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  function goToResult (result: CrmSearchResult) {
    onNavigate?.()
    router.push(result.href)
  }

  function handleKeyDown (event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      return
    }

    if (!hasQuery) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      if (results.length === 0) return
      setActiveIndex((current) => (current + 1) % results.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      if (results.length === 0) return
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1
      )
      return
    }

    if (event.key === 'Enter' && isOpen && activeResult) {
      event.preventDefault()
      goToResult(activeResult)
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search leads, clients and deals"
        className="h-9 rounded-full bg-app-background pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
        aria-label="Search leads, clients and deals"
        aria-autocomplete="list"
        aria-expanded={showPanel}
        aria-controls={listboxId}
        aria-activedescendant={
          showPanel && activeResult ? `${listboxId}-${activeResult.id}` : undefined
        }
        role="combobox"
      />
      {hasQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
          aria-label="Clear search"
          onClick={() => {
            setQuery('')
            setIsOpen(false)
            inputRef.current?.focus()
          }}
        >
          <X />
        </Button>
      )}

      {showPanel && (
        <div
          className={cn(
            'z-50 rounded-xl border border-border bg-surface p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
            layout === 'overlay' ? 'absolute top-full mt-1.5 w-full' : 'mt-3'
          )}
        >
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-text-secondary">
              No leads, clients or deals match “{trimmedQuery}”.
            </p>
          ) : (
            <ul id={listboxId} role="listbox" aria-label="Search results">
              {results.map((result, index) => {
                const isActive = index === activeIndex

                return (
                  <li key={result.id} role="presentation">
                    <Link
                      id={`${listboxId}-${result.id}`}
                      href={result.href}
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm',
                        isActive
                          ? 'bg-surface-strong text-text-primary'
                          : 'text-text-primary hover:bg-surface-muted'
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={(event) => {
                        if (
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          onNavigate?.()
                          return
                        }

                        event.preventDefault()
                        goToResult(result)
                      }}
                    >
                      <span className="min-w-0 truncate font-medium">
                        {result.title}
                      </span>
                      <Badge variant="secondary">
                        {CRM_SEARCH_ENTITY_LABELS[result.entity]}
                      </Badge>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
