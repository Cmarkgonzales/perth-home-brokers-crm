'use client'

import { useState } from 'react'
import {
  buildCustomTemplateFromDesign,
  usePackageWorkspace,
} from '@/components/packages/use-package-workspace'
import { demoLandLots } from '@/data/demo/packages'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface SaveAsTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  landId: string
  designId: string
  selectedExtras: string[]
}

export function SaveAsTemplateDialog ({
  open,
  onOpenChange,
  landId,
  designId,
  selectedExtras,
}: SaveAsTemplateDialogProps) {
  const { houseDesigns, upsertCustomTemplate } = usePackageWorkspace()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const design = houseDesigns.find((item) => item.id === designId)
  const land = demoLandLots.find((lot) => lot.id === landId)

  function handleSave () {
    if (!name.trim()) {
      setError('Enter a template name.')
      return
    }
    if (!design || !land) {
      setError('Select land and design first.')
      return
    }

    const template = buildCustomTemplateFromDesign(
      design,
      land.id,
      selectedExtras,
      name.trim()
    )
    upsertCustomTemplate(template, design)
    setName('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as custom template</DialogTitle>
          <DialogDescription>
            Save the current land, design, and upgrades as a reusable template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="save-template-name" className="text-sm font-medium">
            Template name
          </label>
          <Input
            id="save-template-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={
              design && land
                ? `${design.name} · ${land.suburb}`
                : 'Template name'
            }
          />
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand" onClick={handleSave}>
            Save template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
