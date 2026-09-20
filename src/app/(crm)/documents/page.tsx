import { demoDocuments } from '@/data/demo'
import { PageHeader } from '@/components/layout/page-header'
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

function documentStatusClass (status: (typeof demoDocuments)[number]['status']) {
  if (status === 'missing') return 'bg-danger/10 text-danger'
  if (status === 'review') return 'bg-warning/10 text-warning'
  return 'bg-success/10 text-success'
}

export default function DocumentsPage () {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Track required documents across all deals."
      />

      <Card className="overflow-hidden gap-0 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Deal</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell className="font-mono text-text-tertiary">
                  {doc.dealId}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={documentStatusClass(doc.status)}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
