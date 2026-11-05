'use client'

import { useState } from 'react'
import type {
  ContractDocument,
  ContractSignatoryRole,
} from '@/domain/documents/contract.types'
import { SignatureCaptureDialog } from '@/components/documents/signature-capture-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'

interface ContractSignatoriesPanelProps {
  contract: ContractDocument
  readOnly: boolean
  onSign: (signatoryId: string, signature: import('@/domain/documents/contract.types').ContractSignature) => void
  onAdd: (payload: {
    role: ContractSignatoryRole
    name: string
    email: string
  }) => void
  onRemove: (signatoryId: string) => void
}

export function ContractSignatoriesPanel ({
  contract,
  readOnly,
  onSign,
  onAdd,
  onRemove,
}: ContractSignatoriesPanelProps) {
  const [signTargetId, setSignTargetId] = useState<string | null>(null)
  const [extraName, setExtraName] = useState('')
  const [extraEmail, setExtraEmail] = useState('')

  const signTarget = contract.signatories.find((s) => s.id === signTargetId)

  function handleAddExtra () {
    const name = extraName.trim()
    const email = extraEmail.trim()
    if (!name || !email) return
    onAdd({ role: 'other', name, email })
    setExtraName('')
    setExtraEmail('')
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">Signatories</h3>
        <p className="mt-1 text-xs text-text-tertiary">
          Sender and recipient are required. Progress completes when everyone has signed.
        </p>
      </div>

      <ul className="space-y-3">
        {contract.signatories.map((signatory) => (
          <li
            key={signatory.id}
            className="rounded-lg border border-border bg-surface-muted px-3 py-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {signatory.name}
                </p>
                <p className="text-xs text-text-tertiary">{signatory.email}</p>
                <p className="mt-1 text-xs capitalize text-text-secondary">
                  {signatory.role}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={
                  signatory.status === 'signed'
                    ? 'bg-success/10 text-success'
                    : 'bg-warning/10 text-warning'
                }
              >
                {signatory.status === 'signed' ? 'Signed' : 'Pending'}
              </Badge>
            </div>

            {signatory.signature ? (
              <div className="mt-2 rounded-md border border-border bg-surface px-2 py-2">
                {signatory.signature.kind === 'typed' ? (
                  <p className="font-medium text-text-primary">
                    {signatory.signature.value}
                  </p>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- prototype drawn signature preview
                  <img
                    src={signatory.signature.value}
                    alt={`Signature of ${signatory.name}`}
                    className="max-h-12"
                  />
                )}
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              {!readOnly && signatory.status === 'pending' ? (
                <Button
                  size="sm"
                  variant="brand"
                  onClick={() => setSignTargetId(signatory.id)}
                >
                  Sign
                </Button>
              ) : null}
              {!readOnly &&
              signatory.role === 'other' &&
              signatory.status === 'pending' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemove(signatory.id)}
                  aria-label={`Remove ${signatory.name}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                  Remove
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {!readOnly ? (
        <div className="space-y-2 rounded-lg border border-dashed border-border-strong p-3">
          <p className="text-xs font-medium text-text-secondary">
            Add signatory
          </p>
          <Input
            placeholder="Name"
            value={extraName}
            onChange={(e) => setExtraName(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={extraEmail}
            onChange={(e) => setExtraEmail(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddExtra}
            disabled={!extraName.trim() || !extraEmail.trim()}
          >
            Add signatory
          </Button>
        </div>
      ) : null}

      {signTarget ? (
        <SignatureCaptureDialog
          open={Boolean(signTargetId)}
          onOpenChange={(open) => {
            if (!open) setSignTargetId(null)
          }}
          signatoryName={signTarget.name}
          onConfirm={(signature) => {
            onSign(signTarget.id, signature)
            setSignTargetId(null)
          }}
        />
      ) : null}
    </div>
  )
}
