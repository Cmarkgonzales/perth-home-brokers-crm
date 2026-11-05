'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { getContractExcerpt } from '@/domain/documents/contract-progress'
import { convertUploadedFileToContent } from '@/lib/contracts/convert-upload'
import { useContractDocuments } from '@/lib/contracts/contract-documents-context'
import { ContractSignatureProgress } from '@/components/documents/contract-signature-progress'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUp, Plus } from 'lucide-react'

interface DealContractsSectionProps {
  dealId: string
}

export function DealContractsSection ({ dealId }: DealContractsSectionProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    getContractsByDealId,
    createContractForDeal,
    replaceContractFromUpload,
  } = useContractDocuments()
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const contracts = getContractsByDealId(dealId)

  function handleCreate () {
    setCreating(true)
    const contract = createContractForDeal(
      dealId,
      'New contract'
    )
    setCreating(false)
    if (contract) {
      router.push(`/documents/${dealId}/contracts/${contract.id}`)
    }
  }

  function handleUploadClick () {
    fileInputRef.current?.click()
  }

  async function handleFileChange (
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const contract = createContractForDeal(
        dealId,
        file.name.replace(/\.[^.]+$/, '')
      )
      if (!contract) return

      const content = await convertUploadedFileToContent(file)
      replaceContractFromUpload(contract.id, {
        title: contract.title,
        content,
        originalFileName: file.name,
      })
      router.push(`/documents/${dealId}/contracts/${contract.id}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="gap-0 border-border py-0 shadow-none">
      <CardHeader className="gap-3 border-b border-border py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Contracts</CardTitle>
            <p className="mt-1 text-sm text-text-secondary">
              Create, edit, and track sender and recipient signatures.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="brand"
              size="sm"
              onClick={handleCreate}
              disabled={creating}
            >
              <Plus aria-hidden />
              New contract
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              <FileUp aria-hidden />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {contracts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No contracts for this deal yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {contracts.map((contract) => (
              <li
                key={contract.id}
                className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/documents/${dealId}/contracts/${contract.id}`}
                    className="text-sm font-medium text-text-primary hover:underline"
                  >
                    {contract.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-text-tertiary">
                    {getContractExcerpt(contract.content)}
                  </p>
                  {contract.originalFileName ? (
                    <p className="mt-1 font-mono text-xs text-text-tertiary">
                      Source: {contract.originalFileName}
                    </p>
                  ) : null}
                </div>
                <div className="w-full shrink-0 lg:max-w-xs">
                  <ContractSignatureProgress contract={contract} />
                  <ButtonLink
                    href={`/documents/${dealId}/contracts/${contract.id}`}
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full sm:w-auto"
                  >
                    Open editor
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
