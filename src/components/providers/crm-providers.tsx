'use client'

import type { ReactNode } from 'react'
import { ContractDocumentsProvider } from '@/lib/contracts/contract-documents-context'

export function CrmProviders ({ children }: { children: ReactNode }) {
  return (
    <ContractDocumentsProvider>{children}</ContractDocumentsProvider>
  )
}
