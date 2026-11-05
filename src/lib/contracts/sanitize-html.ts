import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'a',
  'br',
]

const ALLOWED_ATTR = ['href', 'target', 'rel']

export function sanitizeContractHtml (html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}
