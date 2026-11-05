'use client'

import { useMemo, useState } from 'react'
import { Handshake, Plus } from 'lucide-react'
import type { Client } from '@/domain/clients/client.types'
import { formatCurrency } from '@/lib/formatting'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  FormSection,
} from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export type NewDealClientOption = Pick<
  Client,
  'id' | 'name' | 'budget' | 'location' | 'type'
>

interface NewDealDialogProps {
  clients: NewDealClientOption[]
}

export function NewDealDialog ({ clients }: NewDealDialogProps) {
  const [open, setOpen] = useState(false)
  const [clientFilter, setClientFilter] = useState('')
  const [selectedClientId, setSelectedClientId] = useState('')

  const filteredClients = useMemo(() => {
    const query = clientFilter.trim().toLowerCase()
    if (!query) return clients
    return clients.filter((client) =>
      client.name.toLowerCase().includes(query)
    )
  }, [clients, clientFilter])

  const selectedClient = clients.find(
    (client) => client.id === selectedClientId
  )

  function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
    setClientFilter('')
    setSelectedClientId('')
  }

  function handleOpenChange (nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setClientFilter('')
      setSelectedClientId('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="brand" className="h-9 px-3" />}>
        <Plus className="size-4" aria-hidden />
        New deal
      </DialogTrigger>
      <DialogContent size="lg">
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogHeaderIcon>
              <Handshake className="size-4 text-text-secondary" aria-hidden />
            </DialogHeaderIcon>
            <DialogTitle>Create new deal</DialogTitle>
            <DialogDescription>
              Start a deal from an existing client. Link land, finance, and
              package work to one record.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <FormSection title="Client">
              <FormField
                label="Search clients"
                htmlFor="deal-client-filter"
                description="Filter the list, then select a client below."
              >
                <Input
                  id="deal-client-filter"
                  type="search"
                  placeholder="Search by name…"
                  value={clientFilter}
                  onChange={(event) => setClientFilter(event.target.value)}
                />
              </FormField>
              <FormField label="Client" htmlFor="deal-client" required>
                <Select
                  id="deal-client"
                  required
                  value={selectedClientId}
                  onChange={(event) => setSelectedClientId(event.target.value)}
                >
                  <option value="" disabled>
                    Select client
                  </option>
                  {filteredClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              {selectedClient ? (
                <Card className="border-border bg-surface-muted shadow-none">
                  <CardContent className="grid gap-2 py-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-text-tertiary">Type</p>
                      <p className="font-medium text-text-primary">
                        {selectedClient.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary">Location</p>
                      <p className="font-medium text-text-primary">
                        {selectedClient.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary">Budget</p>
                      <p className="font-semibold tabular-nums text-text-primary">
                        {formatCurrency(selectedClient.budget)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </FormSection>

            <FormSection title="Deal details">
              <FormField label="Deal name" htmlFor="deal-name" required>
                <Input
                  id="deal-name"
                  placeholder="Family home package"
                  required
                />
              </FormField>
              <FormField
                label="Estimated value"
                htmlFor="deal-value"
                description={
                  selectedClient
                    ? `Client budget: ${formatCurrency(selectedClient.budget)}`
                    : 'Total expected deal value (AUD).'
                }
              >
                <Input
                  id="deal-value"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder={
                    selectedClient
                      ? String(selectedClient.budget)
                      : '650000'
                  }
                />
              </FormField>
            </FormSection>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
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
