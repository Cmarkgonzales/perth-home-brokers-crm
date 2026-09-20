import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BriefItem {
  text: string
  severity?: 'critical' | 'warning' | 'info'
}

interface AiBusinessBriefProps {
  items: BriefItem[]
  headline?: string
}

const severityDot: Record<NonNullable<BriefItem['severity']>, string> = {
  critical: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
}

export function AiBusinessBrief ({
  items,
  headline = '7 deals require attention',
}: AiBusinessBriefProps) {
  return (
    <Card className="border border-phb-yellow/25 bg-[#FFFCF0] shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="size-4 text-phb-yellow-dark" aria-hidden />
          AI business brief
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-text-primary">{headline}</p>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
              {item.severity && (
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${severityDot[item.severity]}`}
                  aria-hidden
                />
              )}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/ai"
          className="inline-flex h-8 items-center rounded-lg border border-phb-yellow/40 bg-white px-2.5 text-sm font-medium hover:bg-[#FFF9E5]"
        >
          Ask AI → What should I focus on today?
        </Link>
      </CardContent>
    </Card>
  )
}
