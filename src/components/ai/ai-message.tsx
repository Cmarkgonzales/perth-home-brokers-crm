import Link from 'next/link'
import type { AiMessage as AiMessageType } from '@/domain/ai/ai.types'
import { cn } from '@/lib/utils'

interface AiMessageProps {
  message: AiMessageType
}

const severityBorder: Record<string, string> = {
  critical: 'border-l-danger',
  warning: 'border-l-warning',
  info: 'border-l-info',
}

export function AiMessage ({ message }: AiMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'rounded-lg px-4 py-3 text-sm',
        isUser
          ? 'ml-8 bg-surface-strong text-text-primary'
          : 'mr-8 border border-phb-yellow/20 bg-[#FFFCF0] text-text-primary'
      )}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>

      {message.sections?.map((section, index) => (
        <div key={index} className="mt-3">
          <p
            className={cn(
              'mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary',
              section.severity && `border-l-2 pl-2 ${severityBorder[section.severity]}`
            )}
          >
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-text-secondary">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {message.links && message.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-phb-yellow/40 bg-white px-2.5 py-1 text-xs font-medium text-text-primary hover:bg-[#FFF9E5]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
