'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Client } from '@/domain/clients/client.types'
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

interface NewDealDialogProps {
  clients: Pick<Client, 'id' | 'name'>[]
}

export function NewDealDialog ({ clients }: NewDealDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="brand" className="h-9 px-3" />}>
        <Plus className="size-4" aria-hidden />
        New deal
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new deal</DialogTitle>
          <DialogDescription>
            Start a deal from an existing client.
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
            <label htmlFor="deal-client" className="text-sm font-medium">
              Client
            </label>
            <select
              id="deal-client"
              required
              defaultValue=""
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="deal-name" className="text-sm font-medium">
              Deal name
            </label>
            <Input id="deal-name" placeholder="Family home package" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="deal-value" className="text-sm font-medium">
              Estimated value
            </label>
            <Input
              id="deal-value"
              type="number"
              min="0"
              step="1000"
              placeholder="650000"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand">
              Create deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
