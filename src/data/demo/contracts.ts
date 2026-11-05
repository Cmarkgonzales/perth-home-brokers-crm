import type { ContractDocument } from '@/domain/documents/contract.types'

const williamsBuildingBody = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Building contract — Williams Family Home' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This agreement is between Perth Home Brokers (sender) and Sarah & James Williams (recipient) for the design and construction package at Alkimos, Western Australia.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The builder shall complete works in accordance with approved plans. Progress payments follow the schedule attached. Both parties agree to exchange signed copies before construction commences.',
        },
      ],
    },
  ],
} as ContractDocument['content']

const chenDraftBody = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
} as ContractDocument['content']

const smithLandBody = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Land purchase contract — Thompson' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Purchase of Lot 42, Thompson Estate, subject to finance and due diligence. Settlement within 90 days of finance approval.',
        },
      ],
    },
  ],
} as ContractDocument['content']

export const demoContracts: ContractDocument[] = [
  {
    id: 'contract-williams-building',
    dealId: 'PHB-2026-00142',
    title: 'Building contract — Williams Family Home',
    content: williamsBuildingBody,
    source: 'created',
    updatedAt: '2026-03-18T09:30:00.000Z',
    signatories: [
      {
        id: 'sig-williams-sender',
        role: 'sender',
        name: 'James (PHB)',
        email: 'james@phb.example',
        status: 'signed',
        signature: { kind: 'typed', value: 'James Mitchell' },
        signedAt: '2026-03-18T10:00:00.000Z',
      },
      {
        id: 'sig-williams-recipient',
        role: 'recipient',
        name: 'Sarah & James Williams',
        email: 'sarah.williams@example.com',
        status: 'pending',
      },
    ],
  },
  {
    id: 'contract-chen-draft',
    dealId: 'PHB-2026-00138',
    title: 'Package agreement — Chen Residence',
    content: chenDraftBody,
    source: 'created',
    updatedAt: '2026-03-15T14:00:00.000Z',
    signatories: [
      {
        id: 'sig-chen-sender',
        role: 'sender',
        name: 'Arvin (PHB)',
        email: 'arvin@phb.example',
        status: 'pending',
      },
      {
        id: 'sig-chen-recipient',
        role: 'recipient',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        status: 'pending',
      },
    ],
  },
  {
    id: 'contract-smith-land',
    dealId: 'PHB-2026-00129',
    title: 'Land purchase contract — Thompson',
    content: smithLandBody,
    source: 'uploaded',
    originalFileName: 'Thompson_Land_Contract.pdf',
    updatedAt: '2026-03-12T11:20:00.000Z',
    signatories: [
      {
        id: 'sig-smith-sender',
        role: 'sender',
        name: 'Arvin (PHB)',
        email: 'arvin@phb.example',
        status: 'signed',
        signature: { kind: 'typed', value: 'Arvin Santos' },
        signedAt: '2026-03-12T12:00:00.000Z',
      },
      {
        id: 'sig-smith-recipient',
        role: 'recipient',
        name: 'Daniel Smith',
        email: 'daniel.smith@example.com',
        status: 'signed',
        signature: { kind: 'typed', value: 'Daniel Smith' },
        signedAt: '2026-03-12T15:45:00.000Z',
      },
    ],
  },
]
