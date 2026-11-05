'use client'

import { useState } from 'react'
import { Plus, UserPlus } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FormField,
  FormGrid,
  FormSection,
} from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const LEAD_SOURCE_OPTIONS = [
  'Website enquiry',
  'Referral',
  'Facebook ad',
  'Open home',
  'Phone enquiry',
  'Walk-in',
] as const

export function NewLeadDialog () {
  const [open, setOpen] = useState(false)

  function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="brand" />}>
        <Plus className="size-4" aria-hidden />
        New Lead
      </DialogTrigger>
      <DialogContent size="md">
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogHeaderIcon>
              <UserPlus className="size-4 text-text-secondary" aria-hidden />
            </DialogHeaderIcon>
            <DialogTitle>Create new lead</DialogTitle>
            <DialogDescription>
              Add an enquiry to the pipeline. The lead will appear in Leads as
              New for follow-up.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <FormSection title="Contact">
              <FormField label="Name" htmlFor="lead-name" required>
                <Input id="lead-name" placeholder="Client name" required />
              </FormField>
              <FormGrid>
                <FormField label="Email" htmlFor="lead-email">
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="email@example.com"
                  />
                </FormField>
                <FormField label="Phone" htmlFor="lead-phone">
                  <Input id="lead-phone" type="tel" placeholder="04xx xxx xxx" />
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="Qualification">
              <FormGrid>
                <FormField
                  label="Budget"
                  htmlFor="lead-budget"
                  description="Estimated house and land budget (AUD)."
                >
                  <Input
                    id="lead-budget"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="650000"
                  />
                </FormField>
                <FormField label="Source" htmlFor="lead-source">
                  <Select id="lead-source" defaultValue="">
                    <option value="" disabled>
                      Select source
                    </option>
                    {LEAD_SOURCE_OPTIONS.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection title="Notes">
              <FormField
                label="Initial notes"
                htmlFor="lead-notes"
                description="First call context, suburb interest, or timing."
              >
                <Textarea
                  id="lead-notes"
                  placeholder="Interested in northern suburbs, finance pre-approval in progress…"
                  rows={3}
                />
              </FormField>
            </FormSection>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="brand">
              Create lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
