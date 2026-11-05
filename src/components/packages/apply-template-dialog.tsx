'use client'

import { useState } from 'react'
import type { Deal } from '@/domain/deals/deal.types'
import type { ResolvedPackageTemplate } from '@/domain/packages/package-template-utils'
import { buildDealPackageFromTemplate } from '@/domain/packages/package-template-utils'
import { demoClients } from '@/data/demo/clients'
import { demoPackageExtras } from '@/data/demo/packages'
import { formatDealBudgetHint } from '@/domain/packages/deal-budget-hint'
import { formatCurrency } from '@/lib/formatting'
import { usePackageWorkspace } from '@/components/packages/use-package-workspace'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderIcon,
  DialogTitle,
} from '@/components/ui/dialog'
import { PackageOpen } from 'lucide-react'
import { FormField } from '@/components/ui/form-field'
import { Select } from '@/components/ui/select'

interface ApplyTemplateDialogProps {
  template: ResolvedPackageTemplate | null
  deals: Deal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplyTemplateDialog ({
  template,
  deals,
  open,
  onOpenChange,
}: ApplyTemplateDialogProps) {
  const { saveDealPackage } = usePackageWorkspace()
  const [selectedDealId, setSelectedDealId] = useState('')

  function handleApply () {
    if (!template || !selectedDealId) return
    const config = buildDealPackageFromTemplate(
      selectedDealId,
      template,
      demoPackageExtras
    )
    saveDealPackage(config)
    onOpenChange(false)
    setSelectedDealId('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogHeaderIcon>
            <PackageOpen className="size-4 text-text-secondary" aria-hidden />
          </DialogHeaderIcon>
          <DialogTitle>Use template on deal</DialogTitle>
          <DialogDescription>
            {template
              ? `Apply ${template.name} (${formatCurrency(template.total)}) to an active deal.`
              : 'Select a deal for this template.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FormField label="Deal" htmlFor="apply-deal">
            <Select
              id="apply-deal"
              value={selectedDealId}
              onChange={(event) => setSelectedDealId(event.target.value)}
            >
              <option value="">Select deal</option>
              {deals.map((deal) => {
                const client = demoClients.find((c) => c.id === deal.clientId)
                const budgetHint =
                  client !== undefined && template
                    ? ` · ${formatDealBudgetHint(client.budget, template.total)}`
                    : ''

                return (
                  <option key={deal.id} value={deal.id}>
                    {deal.name} ({deal.id}){budgetHint}
                  </option>
                )
              })}
            </Select>
          </FormField>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand"
            disabled={!selectedDealId || !template}
            onClick={handleApply}
          >
            Apply template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
