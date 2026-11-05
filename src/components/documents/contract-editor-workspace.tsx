'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { getDealById } from '@/data/demo/helpers'
import { getContractProgress } from '@/domain/documents/contract-progress'
import type { ContractDocument } from '@/domain/documents/contract.types'
import { convertUploadedFileToContent } from '@/lib/contracts/convert-upload'
import { contractEditorExtensions } from '@/lib/contracts/editor-extensions'
import {
  downloadPdfBlob,
  generateContractPdfBlob,
} from '@/lib/contracts/generate-pdf'
import { useContractDocuments } from '@/lib/contracts/contract-documents-context'
import { ContractEditorToolbar } from '@/components/documents/contract-editor-toolbar'
import { ContractSignatoriesPanel } from '@/components/documents/contract-signatories-panel'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FileUp, Save } from 'lucide-react'

interface ContractEditorWorkspaceProps {
  dealId: string
  contractId: string
}

export function ContractEditorWorkspace ({
  dealId,
  contractId,
}: ContractEditorWorkspaceProps) {
  const { getContractById } = useContractDocuments()
  const contract = getContractById(contractId)

  if (!contract) {
    return (
      <Card className="border-border shadow-none">
        <CardContent className="py-10 text-center text-sm text-text-secondary">
          Contract not found.{' '}
          <Link href={`/documents/${dealId}`} className="underline">
            Back to deal documents
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <ContractEditorBody
      key={contractId}
      dealId={dealId}
      contract={contract}
    />
  )
}

interface ContractEditorBodyProps {
  dealId: string
  contract: ContractDocument
}

function ContractEditorBody ({ dealId, contract }: ContractEditorBodyProps) {
  const deal = getDealById(dealId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfPreviewUrlRef = useRef<string | null>(null)
  const {
    getContractById,
    updateContractContent,
    reviseContract,
    addSignatory,
    removeSignatory,
    signAsSignatory,
    replaceContractFromUpload,
  } = useContractDocuments()

  const liveContract = getContractById(contract.id) ?? contract
  const [title, setTitle] = useState(liveContract.title)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadNotice, setUploadNotice] = useState<string | null>(null)

  const progress = getContractProgress(liveContract)
  const readOnly = progress === 'complete'

  const editor = useEditor({
    extensions: contractEditorExtensions,
    content: liveContract.content,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[320px] px-4 py-4 focus:outline-none text-text-primary',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!readOnly)
    const currentJson = JSON.stringify(editor.getJSON())
    const nextJson = JSON.stringify(liveContract.content)
    if (currentJson !== nextJson) {
      editor.commands.setContent(liveContract.content, { emitUpdate: false })
    }
  }, [editor, liveContract.content, readOnly])

  useEffect(() => {
    return () => {
      if (pdfPreviewUrlRef.current) {
        URL.revokeObjectURL(pdfPreviewUrlRef.current)
      }
    }
  }, [])

  function handleSave () {
    if (!editor || readOnly) return
    const content = editor.getJSON()
    updateContractContent(
      liveContract.id,
      content,
      title.trim() || liveContract.title
    )
    setSavedNotice(
      'Contract saved. Signatures reset if the body changed after signing.'
    )
    window.setTimeout(() => setSavedNotice(null), 4000)
  }

  function handleRevise () {
    reviseContract(liveContract.id)
    setSavedNotice('Contract unlocked for revision. All signatures cleared.')
  }

  async function buildPdfBlob () {
    const latest = getContractById(liveContract.id) ?? liveContract
    return generateContractPdfBlob({
      ...latest,
      title: title.trim() || latest.title,
      content: editor?.getJSON() ?? latest.content,
    })
  }

  async function handlePreviewPdf () {
    const blob = await buildPdfBlob()
    if (pdfPreviewUrlRef.current) {
      URL.revokeObjectURL(pdfPreviewUrlRef.current)
    }
    const url = URL.createObjectURL(blob)
    pdfPreviewUrlRef.current = url
    setPdfPreviewUrl(url)
    setPdfOpen(true)
  }

  async function handleDownloadPdf () {
    const blob = await buildPdfBlob()
    const safeName = (title.trim() || liveContract.title)
      .replace(/[^\w\s-]/g, '')
      .trim()
    downloadPdfBlob(blob, `${safeName || 'contract'}.pdf`)
  }

  async function handleUpload (file: File) {
    setUploading(true)
    setUploadNotice(null)
    try {
      const content = await convertUploadedFileToContent(file)
      const nextTitle = file.name.replace(/\.[^.]+$/, '')
      replaceContractFromUpload(liveContract.id, {
        title: nextTitle,
        content,
        originalFileName: file.name,
      })
      setTitle(nextTitle)
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setUploadNotice(
          'PDF converted to editable text. Layout and images are not preserved.'
        )
      }
    } catch (error) {
      setUploadNotice(
        error instanceof Error ? error.message : 'Upload conversion failed.'
      )
    } finally {
      setUploading(false)
    }
  }

  if (!deal) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
              <li>
                <Link href="/documents" className="hover:text-text-primary">
                  Documents
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/documents/${dealId}`}
                  className="hover:text-text-primary"
                >
                  {deal.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-text-secondary">Contract editor</li>
            </ol>
          </nav>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={readOnly}
            aria-label="Contract title"
            className="max-w-xl text-base font-semibold"
          />
          {liveContract.originalFileName ? (
            <p className="font-mono text-xs text-text-tertiary">
              Source file: {liveContract.originalFileName}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {!readOnly ? (
            <Button variant="brand" size="sm" onClick={handleSave}>
              <Save aria-hidden />
              Save
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleRevise}>
              Revise contract
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => void handlePreviewPdf()}>
            Preview PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => void handleDownloadPdf()}>
            Download PDF
          </Button>
          {!readOnly ? (
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp aria-hidden />
              {uploading ? 'Converting…' : 'Upload file'}
            </Button>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.pdf"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) void handleUpload(file)
            }}
          />
          <ButtonLink href={`/documents/${dealId}`} variant="outline" size="sm">
            Back
          </ButtonLink>
        </div>
      </div>

      {savedNotice ? (
        <p className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary">
          {savedNotice}
        </p>
      ) : null}
      {uploadNotice ? (
        <p className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm text-text-secondary">
          {uploadNotice}
        </p>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="overflow-hidden border-border py-0 shadow-none">
          <ContractEditorToolbar editor={editor} disabled={readOnly} />
          <div className="bg-surface">
            <EditorContent editor={editor} />
          </div>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContractSignatoriesPanel
              contract={liveContract}
              readOnly={readOnly}
              onSign={(signatoryId, signature) =>
                signAsSignatory(liveContract.id, signatoryId, signature)
              }
              onAdd={(payload) => addSignatory(liveContract.id, payload)}
              onRemove={(signatoryId) =>
                removeSignatory(liveContract.id, signatoryId)
              }
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-h-[90vh] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>PDF preview</DialogTitle>
          </DialogHeader>
          {pdfPreviewUrl ? (
            <iframe
              title="Contract PDF preview"
              src={pdfPreviewUrl}
              className="h-[70vh] w-full rounded-lg border border-border bg-surface-muted"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
