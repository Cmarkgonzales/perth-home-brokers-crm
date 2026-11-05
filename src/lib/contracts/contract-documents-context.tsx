'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { JSONContent } from '@tiptap/core'
import { demoContracts } from '@/data/demo/contracts'
import { getClientById, getDealById } from '@/data/demo/helpers'
import {
  applyBodyEditToContract,
  applyReviseContract,
} from '@/domain/documents/contract-progress'
import {
  createBlankContract,
  createContractId,
  createSignatoryId,
} from '@/domain/documents/contract-factory'
import type {
  ContractDocument,
  ContractSignatory,
  ContractSignature,
} from '@/domain/documents/contract.types'

const STORAGE_KEY = 'phb-contract-documents-v1'

interface ContractDocumentsContextValue {
  isHydrated: boolean
  contracts: ContractDocument[]
  getContractById: (id: string) => ContractDocument | undefined
  getContractsByDealId: (dealId: string) => ContractDocument[]
  saveContract: (contract: ContractDocument) => void
  createContractForDeal: (dealId: string, title: string) => ContractDocument | undefined
  updateContractContent: (
    contractId: string,
    content: JSONContent,
    title?: string
  ) => void
  reviseContract: (contractId: string) => void
  addSignatory: (
    contractId: string,
    signatory: Omit<ContractSignatory, 'id' | 'status'>
  ) => void
  removeSignatory: (contractId: string, signatoryId: string) => void
  signAsSignatory: (
    contractId: string,
    signatoryId: string,
    signature: ContractSignature
  ) => void
  replaceContractFromUpload: (
    contractId: string,
    payload: {
      title: string
      content: JSONContent
      originalFileName: string
    }
  ) => void
}

const ContractDocumentsContext =
  createContext<ContractDocumentsContextValue | null>(null)

function loadStoredContracts (): ContractDocument[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ContractDocument[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function persistContracts (contracts: ContractDocument[]) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(contracts))
}

export function ContractDocumentsProvider ({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<ContractDocument[]>(demoContracts)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = loadStoredContracts()
    if (stored) {
      queueMicrotask(() => setContracts(stored))
    }
    queueMicrotask(() => setHydrated(true))
  }, [])

  useEffect(() => {
    if (!hydrated) return
    persistContracts(contracts)
  }, [contracts, hydrated])

  const saveContract = useCallback((contract: ContractDocument) => {
    setContracts((prev) => {
      const index = prev.findIndex((c) => c.id === contract.id)
      if (index === -1) {
        return [...prev, contract]
      }
      const next = [...prev]
      next[index] = contract
      return next
    })
  }, [])

  const getContractById = useCallback(
    (id: string) => contracts.find((c) => c.id === id),
    [contracts]
  )

  const getContractsByDealId = useCallback(
    (dealId: string) =>
      contracts.filter((c) => c.dealId === dealId).sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      ),
    [contracts]
  )

  const createContractForDeal = useCallback(
    (dealId: string, title: string) => {
      const deal = getDealById(dealId)
      if (!deal) return undefined
      const client = getClientById(deal.clientId)
      if (!client) return undefined
      const contract = createBlankContract(
        deal,
        client,
        createContractId(),
        title,
        new Date().toISOString()
      )
      saveContract(contract)
      return contract
    },
    [saveContract]
  )

  const updateContractContent = useCallback(
    (contractId: string, content: JSONContent, title?: string) => {
      setContracts((prev) =>
        prev.map((contract) => {
          if (contract.id !== contractId) return contract
          const updated = applyBodyEditToContract(
            title ? { ...contract, title } : contract,
            content,
            new Date().toISOString()
          )
          return updated
        })
      )
    },
    []
  )

  const reviseContract = useCallback((contractId: string) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? applyReviseContract(contract, new Date().toISOString())
          : contract
      )
    )
  }, [])

  const addSignatory = useCallback(
    (
      contractId: string,
      signatory: Omit<ContractSignatory, 'id' | 'status'>
    ) => {
      setContracts((prev) =>
        prev.map((contract) => {
          if (contract.id !== contractId) return contract
          return {
            ...contract,
            updatedAt: new Date().toISOString(),
            signatories: [
              ...contract.signatories,
              {
                ...signatory,
                id: createSignatoryId(),
                status: 'pending',
              },
            ],
          }
        })
      )
    },
    []
  )

  const removeSignatory = useCallback(
    (contractId: string, signatoryId: string) => {
      setContracts((prev) =>
        prev.map((contract) => {
          if (contract.id !== contractId) return contract
          const target = contract.signatories.find((s) => s.id === signatoryId)
          if (!target || target.role === 'sender' || target.role === 'recipient') {
            return contract
          }
          return {
            ...contract,
            updatedAt: new Date().toISOString(),
            signatories: contract.signatories.filter(
              (s) => s.id !== signatoryId
            ),
          }
        })
      )
    },
    []
  )

  const signAsSignatory = useCallback(
    (
      contractId: string,
      signatoryId: string,
      signature: ContractSignature
    ) => {
      setContracts((prev) =>
        prev.map((contract) => {
          if (contract.id !== contractId) return contract
          return {
            ...contract,
            updatedAt: new Date().toISOString(),
            signatories: contract.signatories.map((s) =>
              s.id === signatoryId
                ? {
                    ...s,
                    status: 'signed' as const,
                    signature,
                    signedAt: new Date().toISOString(),
                  }
                : s
            ),
          }
        })
      )
    },
    []
  )

  const replaceContractFromUpload = useCallback(
    (
      contractId: string,
      payload: {
        title: string
        content: JSONContent
        originalFileName: string
      }
    ) => {
      setContracts((prev) =>
        prev.map((contract) => {
          if (contract.id !== contractId) return contract
          const cleared = applyReviseContract(contract, new Date().toISOString())
          return applyBodyEditToContract(
            {
              ...cleared,
              title: payload.title,
              source: 'uploaded',
              originalFileName: payload.originalFileName,
            },
            payload.content,
            new Date().toISOString()
          )
        })
      )
    },
    []
  )

  const value = useMemo(
    () => ({
      isHydrated: hydrated,
      contracts,
      getContractById,
      getContractsByDealId,
      saveContract,
      createContractForDeal,
      updateContractContent,
      reviseContract,
      addSignatory,
      removeSignatory,
      signAsSignatory,
      replaceContractFromUpload,
    }),
    [
      hydrated,
      contracts,
      getContractById,
      getContractsByDealId,
      saveContract,
      createContractForDeal,
      updateContractContent,
      reviseContract,
      addSignatory,
      removeSignatory,
      signAsSignatory,
      replaceContractFromUpload,
    ]
  )

  return (
    <ContractDocumentsContext.Provider value={value}>
      {children}
    </ContractDocumentsContext.Provider>
  )
}

export function useContractDocuments (): ContractDocumentsContextValue {
  const ctx = useContext(ContractDocumentsContext)
  if (!ctx) {
    throw new Error(
      'useContractDocuments must be used within ContractDocumentsProvider'
    )
  }
  return ctx
}
