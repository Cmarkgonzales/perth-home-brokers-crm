import type { JSONContent } from '@tiptap/core'
import { generateJSON } from '@tiptap/html'
import { contractEditorExtensions } from '@/lib/contracts/editor-extensions'
import { sanitizeContractHtml } from '@/lib/contracts/sanitize-html'
import { EMPTY_CONTRACT_CONTENT } from '@/domain/documents/contract.constants'

function htmlToTiptapJson (html: string): JSONContent {
  const clean = sanitizeContractHtml(html)
  if (!clean.trim()) {
    return structuredClone(EMPTY_CONTRACT_CONTENT)
  }
  return generateJSON(clean, contractEditorExtensions)
}

export async function convertDocxFileToContent (
  file: File
): Promise<JSONContent> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  return htmlToTiptapJson(result.value)
}

export async function convertPdfFileToContent (
  file: File
): Promise<JSONContent> {
  const pdfjs = await import('pdfjs-dist')

  if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
  }

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise
  const paragraphs: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (pageText) {
      paragraphs.push(pageText)
    }
  }

  if (paragraphs.length === 0) {
    return structuredClone(EMPTY_CONTRACT_CONTENT)
  }

  const html = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
  return htmlToTiptapJson(html)
}

function escapeHtml (value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function convertUploadedFileToContent (
  file: File
): Promise<JSONContent> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.docx')) {
    return convertDocxFileToContent(file)
  }
  if (name.endsWith('.pdf')) {
    return convertPdfFileToContent(file)
  }
  throw new Error('Unsupported file type. Use .docx or .pdf.')
}
