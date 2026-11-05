'use client'

import { useMemo, useState } from 'react'
import type { ResolvedPackageTemplate } from '@/domain/packages/package-template-utils'
import {
  filterPackageTemplates,
  resolvePackageTemplates,
} from '@/domain/packages/package-template-utils'
import {
  DEFAULT_PACKAGE_TEMPLATE_FILTERS,
} from '@/domain/packages/package.types'
import { demoLandLots, demoPackageExtras } from '@/data/demo/packages'
import { formatCurrency } from '@/lib/formatting'
import { usePackageWorkspace } from '@/components/packages/use-package-workspace'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ChangeTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (template: ResolvedPackageTemplate) => void
}

export function ChangeTemplateDialog ({
  open,
  onOpenChange,
  onSelect,
}: ChangeTemplateDialogProps) {
  const { templates, houseDesigns } = usePackageWorkspace()
  const [query, setQuery] = useState('')

  const resolved = useMemo(
    () =>
      resolvePackageTemplates(
        templates,
        houseDesigns,
        demoLandLots,
        demoPackageExtras
      ),
    [templates, houseDesigns]
  )

  const filtered = useMemo(() => {
    const base = filterPackageTemplates(resolved, {
      ...DEFAULT_PACKAGE_TEMPLATE_FILTERS,
    })
    if (!query.trim()) return base
    const lower = query.toLowerCase()
    return base.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.design.name.toLowerCase().includes(lower) ||
        item.land.suburb.toLowerCase().includes(lower)
    )
  }, [resolved, query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change template</DialogTitle>
          <DialogDescription>
            Pick a starting template. Your deal will keep its own copy.
          </DialogDescription>
        </DialogHeader>

        <input
          type="search"
          placeholder="Search templates…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />

        <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {filtered.map((template) => (
            <li key={template.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-3 text-left text-sm hover:bg-surface-muted"
                onClick={() => {
                  onSelect(template)
                  onOpenChange(false)
                  setQuery('')
                }}
              >
                <span>
                  <span className="font-medium text-text-primary">
                    {template.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-text-tertiary">
                    {template.land.suburb} · {template.design.bedrooms} bed
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatCurrency(template.total)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
