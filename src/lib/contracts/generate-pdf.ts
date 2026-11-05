import type { JSONContent } from '@tiptap/core'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { ContractDocument } from '@/domain/documents/contract.types'
import { extractTextFromContent } from '@/domain/documents/contract-progress'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 50
const LINE_HEIGHT = 14

interface TextLine {
  text: string
  bold?: boolean
  size?: number
}

function flattenContent (content: JSONContent): TextLine[] {
  const lines: TextLine[] = []

  function walk (node: JSONContent, ctx: { bold: boolean; size: number }) {
    if (node.type === 'heading') {
      const level = node.attrs?.level === 3 ? 14 : 16
      const text = collectText(node)
      if (text) lines.push({ text, bold: true, size: level })
      return
    }
    if (node.type === 'paragraph') {
      const text = collectText(node)
      lines.push({ text: text || ' ', bold: ctx.bold, size: ctx.size })
      return
    }
    if (node.type === 'bulletList' || node.type === 'orderedList') {
      node.content?.forEach((item, index) => {
        const prefix =
          node.type === 'orderedList' ? `${index + 1}. ` : '• '
        const text = collectText(item)
        lines.push({ text: `${prefix}${text}`, size: ctx.size })
      })
      return
    }
    if (node.type === 'text') {
      return
    }
    node.content?.forEach((child) => walk(child, ctx))
  }

  function collectText (node: JSONContent): string {
    if (node.type === 'text' && node.text) {
      return node.text
    }
    return (node.content ?? []).map(collectText).join('')
  }

  content.content?.forEach((node) => walk(node, { bold: false, size: 11 }))
  return lines
}

function wrapLine (
  text: string,
  font: Awaited<ReturnType<PDFDocument['embedFont']>>,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/)
  const result: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    const width = font.widthOfTextAtSize(candidate, size)
    if (width > maxWidth && current) {
      result.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) result.push(current)
  return result.length > 0 ? result : ['']
}

export async function generateContractPdfBlob (
  contract: ContractDocument
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const maxWidth = PAGE_WIDTH - MARGIN * 2
  let y = PAGE_HEIGHT - MARGIN

  const title = contract.title
  page.drawText(title, {
    x: MARGIN,
    y,
    size: 18,
    font: bold,
    color: rgb(0.14, 0.14, 0.14),
  })
  y -= 28

  const bodyLines = flattenContent(contract.content)
  for (const line of bodyLines) {
    const font = line.bold ? bold : regular
    const size = line.size ?? 11
    const wrapped = wrapLine(line.text, font, size, maxWidth)
    for (const segment of wrapped) {
      if (y < MARGIN + 120) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = PAGE_HEIGHT - MARGIN
      }
      page.drawText(segment, {
        x: MARGIN,
        y,
        size,
        font,
        color: rgb(0.14, 0.14, 0.14),
      })
      y -= LINE_HEIGHT + (size > 12 ? 4 : 0)
    }
    y -= 4
  }

  y -= 16
  page.drawText('Signatures', {
    x: MARGIN,
    y,
    size: 14,
    font: bold,
    color: rgb(0.14, 0.14, 0.14),
  })
  y -= 24

  for (const signatory of contract.signatories) {
    if (y < MARGIN + 60) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - MARGIN
    }
    page.drawText(`${signatory.name} (${signatory.role})`, {
      x: MARGIN,
      y,
      size: 11,
      font: bold,
      color: rgb(0.14, 0.14, 0.14),
    })
    y -= LINE_HEIGHT

    if (signatory.status === 'signed' && signatory.signature) {
      if (signatory.signature.kind === 'typed') {
        page.drawText(signatory.signature.value, {
          x: MARGIN,
          y,
          size: 14,
          font: regular,
          color: rgb(0.1, 0.1, 0.35),
        })
        y -= LINE_HEIGHT
      } else if (signatory.signature.kind === 'drawn') {
        try {
          const pngBytes = dataUrlToUint8Array(signatory.signature.value)
          const png = await pdfDoc.embedPng(pngBytes)
          const scale = Math.min(180 / png.width, 48 / png.height)
          page.drawImage(png, {
            x: MARGIN,
            y: y - png.height * scale,
            width: png.width * scale,
            height: png.height * scale,
          })
          y -= png.height * scale + 8
        } catch {
          page.drawText('[Drawn signature]', {
            x: MARGIN,
            y,
            size: 10,
            font: regular,
            color: rgb(0.4, 0.4, 0.4),
          })
          y -= LINE_HEIGHT
        }
      }
      if (signatory.signedAt) {
        page.drawText(`Signed ${new Date(signatory.signedAt).toLocaleString()}`, {
          x: MARGIN,
          y,
          size: 9,
          font: regular,
          color: rgb(0.45, 0.45, 0.45),
        })
        y -= LINE_HEIGHT
      }
    } else {
      page.drawText('Pending signature', {
        x: MARGIN,
        y,
        size: 10,
        font: regular,
        color: rgb(0.55, 0.55, 0.55),
      })
      y -= LINE_HEIGHT
    }
    y -= 12
  }

  const plainFallback = extractTextFromContent(contract.content)
  if (plainFallback) {
    pdfDoc.setTitle(contract.title)
  }

  const bytes = await pdfDoc.save()
  return new Blob([bytes as BlobPart], { type: 'application/pdf' })
}

function dataUrlToUint8Array (dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1]
  if (!base64) throw new Error('Invalid data URL')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function downloadPdfBlob (blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}
