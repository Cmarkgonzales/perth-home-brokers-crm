import Link from 'next/link'
import type { DocumentsByDeal } from '@/data/demo/helpers'
import {
  DOCUMENT_STATUS_CLASS,
  DOCUMENT_STATUS_LABEL,
} from '@/domain/documents/document.constants'
import { DocumentProgressBar } from '@/components/documents/document-progress-bar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DocumentsHubProps {
  groups: DocumentsByDeal[]
}

function AttentionBadges ({ group }: { group: DocumentsByDeal }) {
  if (group.missingCount === 0 && group.reviewCount === 0) {
    return (
      <Badge variant="secondary" className={DOCUMENT_STATUS_CLASS.complete}>
        Complete
      </Badge>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {group.missingCount > 0 ? (
        <Badge variant="secondary" className={DOCUMENT_STATUS_CLASS.missing}>
          {group.missingCount} {DOCUMENT_STATUS_LABEL.missing.toLowerCase()}
        </Badge>
      ) : null}
      {group.reviewCount > 0 ? (
        <Badge variant="secondary" className={DOCUMENT_STATUS_CLASS.review}>
          {group.reviewCount} {DOCUMENT_STATUS_LABEL.review.toLowerCase()}
        </Badge>
      ) : null}
    </div>
  )
}

export function DocumentsHub ({ groups }: DocumentsHubProps) {
  if (groups.length === 0) {
    return (
      <Card className="border-border shadow-none">
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          No documents recorded yet.
        </p>
      </Card>
    )
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <ul className="divide-y divide-border md:hidden">
        {groups.map((group) => (
          <li key={group.dealId}>
            <Link
              href={`/documents/${group.dealId}`}
              className="block p-4 transition-colors hover:bg-table-hover focus-visible:bg-table-hover focus-visible:outline-none"
            >
              <p className="font-medium text-text-primary">{group.dealName}</p>
              <p className="mt-0.5 text-sm text-text-secondary">
                {group.clientName}
              </p>
              <p className="font-mono text-xs text-text-tertiary">{group.dealId}</p>
              <div className="mt-3 flex items-center gap-3">
                <DocumentProgressBar
                  verifiedCount={group.verifiedCount}
                  requiredCount={group.requiredCount}
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
                />
                <p className="text-xs tabular-nums text-text-tertiary">
                  {group.verifiedCount}/{group.requiredCount}
                </p>
              </div>
              <div className="mt-3">
                <AttentionBadges group={group} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.dealId} className="relative">
                <TableCell>
                  <Link
                    href={`/documents/${group.dealId}`}
                    className="font-medium text-text-primary after:absolute after:inset-0 hover:text-text-primary"
                  >
                    {group.dealName}
                  </Link>
                  <p className="font-mono text-xs text-text-tertiary">
                    {group.dealId}
                  </p>
                </TableCell>
                <TableCell>{group.clientName}</TableCell>
                <TableCell>
                  <div className="flex min-w-28 items-center gap-2">
                    <DocumentProgressBar
                      verifiedCount={group.verifiedCount}
                      requiredCount={group.requiredCount}
                      className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-border"
                    />
                    <span className="text-xs tabular-nums text-text-tertiary">
                      {group.verifiedCount}/{group.requiredCount}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <AttentionBadges group={group} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
