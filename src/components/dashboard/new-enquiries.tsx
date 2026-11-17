import Link from 'next/link'
import type { DashboardEnquiryRow } from '@/domain/dashboard/dashboard.types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface NewEnquiriesProps {
  enquiries: DashboardEnquiryRow[]
  total: number
}

function enquiryInitial (name: string): string {
  const parts = name.split(/\s+/)
  const first = parts[0]?.charAt(0) ?? ''
  const second = parts[1]?.charAt(0) ?? ''
  return (first + second).toUpperCase() || '?'
}

export function NewEnquiries ({ enquiries, total }: NewEnquiriesProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-base font-semibold text-text-primary">
          New enquiries
        </CardTitle>
        <span className="flex shrink-0 items-center gap-2 text-xs">
          <span className="font-semibold tabular-nums text-info">
            {total} new
          </span>
          <span className="text-border-strong" aria-hidden>
            ·
          </span>
          <Link
            href="/leads?status=New"
            className="font-medium text-text-tertiary hover:text-text-primary"
          >
            View all →
          </Link>
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {enquiries.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-secondary">
            No new enquiries waiting.
          </p>
        ) : (
          enquiries.map((item) => (
            <Link
              key={item.leadId}
              href={item.href}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface-muted p-3 transition-colors hover:bg-table-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Avatar size="sm">
                <AvatarFallback className="text-[10px] font-semibold">
                  {enquiryInitial(item.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  {item.name}
                </p>
                <p className="mt-0.5 text-[13px] text-text-secondary">
                  {item.line}
                </p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}