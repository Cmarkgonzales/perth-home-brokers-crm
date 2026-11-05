import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  applyBodyEditToContract,
  getContractProgress,
  getSignatureProgress,
  isContractBodyEmpty,
} from '@/domain/documents/contract-progress'
import { EMPTY_CONTRACT_CONTENT } from '@/domain/documents/contract.constants'
import type { ContractDocument, ContractSignatory } from '@/domain/documents/contract.types'

function baseContract (
  overrides: Partial<ContractDocument> = {}
): ContractDocument {
  const signatories: ContractSignatory[] = [
    {
      id: 'sig-sender',
      role: 'sender',
      name: 'James Broker',
      email: 'james@phb.example',
      status: 'pending',
    },
    {
      id: 'sig-recipient',
      role: 'recipient',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      status: 'pending',
    },
  ]

  return {
    id: 'contract-test',
    dealId: 'PHB-2026-00142',
    title: 'Test contract',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Agreement clause one.' }],
        },
      ],
    },
    signatories,
    source: 'created',
    updatedAt: '2026-03-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('contract progress', () => {
  it('returns draft when body is empty', () => {
    const contract = baseContract({ content: EMPTY_CONTRACT_CONTENT })
    assert.equal(getContractProgress(contract), 'draft')
  })

  it('returns awaiting_signatures when body ready and none signed', () => {
    assert.equal(getContractProgress(baseContract()), 'awaiting_signatures')
  })

  it('returns partially_signed when one party signed', () => {
    const contract = baseContract({
      signatories: baseContract().signatories.map((s) =>
        s.role === 'sender'
          ? {
              ...s,
              status: 'signed' as const,
              signature: { kind: 'typed' as const, value: 'James Broker' },
              signedAt: '2026-03-02T00:00:00.000Z',
            }
          : s
      ),
    })
    assert.equal(getContractProgress(contract), 'partially_signed')
    assert.deepEqual(getSignatureProgress(contract.signatories), {
      signedCount: 1,
      totalCount: 2,
    })
  })

  it('returns complete only when all signatories signed including extras', () => {
    const signatories: ContractSignatory[] = [
      ...baseContract().signatories.map((s) => ({
        ...s,
        status: 'signed' as const,
        signature: { kind: 'typed' as const, value: s.name },
        signedAt: '2026-03-02T00:00:00.000Z',
      })),
      {
        id: 'sig-witness',
        role: 'other' as const,
        name: 'Witness',
        email: 'witness@example.com',
        status: 'pending' as const,
      },
    ]
    const partial = baseContract({ signatories })
    assert.equal(getContractProgress(partial), 'partially_signed')

    const complete = baseContract({
      signatories: signatories.map((s) =>
        s.id === 'sig-witness'
          ? {
              ...s,
              status: 'signed' as const,
              signature: { kind: 'typed' as const, value: 'Witness' },
              signedAt: '2026-03-03T00:00:00.000Z',
            }
          : s
      ),
    })
    assert.equal(getContractProgress(complete), 'complete')
  })

  it('clears signatures when body is edited after signing', () => {
    const signed = baseContract({
      signatories: baseContract().signatories.map((s) => ({
        ...s,
        status: 'signed' as const,
        signature: { kind: 'typed' as const, value: s.name },
        signedAt: '2026-03-02T00:00:00.000Z',
      })),
    })
    const newContent = {
      type: 'doc' as const,
      content: [
        {
          type: 'paragraph' as const,
          content: [{ type: 'text' as const, text: 'Revised clause.' }],
        },
      ],
    }
    const updated = applyBodyEditToContract(
      signed,
      newContent,
      '2026-03-04T00:00:00.000Z'
    )
    assert.equal(
      updated.signatories.every((s) => s.status === 'pending'),
      true
    )
    assert.equal(getContractProgress(updated), 'awaiting_signatures')
    assert.equal(isContractBodyEmpty(newContent), false)
  })
})
