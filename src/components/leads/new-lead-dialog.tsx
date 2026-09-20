'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function NewLeadDialog () {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="brand" />}
      >
        + New Lead
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new lead</DialogTitle>
          <DialogDescription>
            Capture a new enquiry. This prototype does not persist data.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            setOpen(false)
          }}
        >
          <div className="space-y-2">
            <label htmlFor="lead-name" className="text-sm font-medium">
              Name
            </label>
            <Input id="lead-name" placeholder="Client name" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="lead-email" className="text-sm font-medium">
              Email
            </label>
            <Input id="lead-email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="lead-source" className="text-sm font-medium">
              Source
            </label>
            <Input id="lead-source" placeholder="Website, referral..." />
          </div>
          <div className="space-y-2">
            <label htmlFor="lead-notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea id="lead-notes" placeholder="Initial enquiry details" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
