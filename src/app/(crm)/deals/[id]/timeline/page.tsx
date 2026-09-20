import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDealById, getActivitiesByDealId } from '@/data/demo'
import { DealTimeline } from '@/components/deals/deal-timeline'

export default async function DealTimelinePage ({
  params,
}: PageProps<'/deals/[id]/timeline'>) {
  const { id } = await params
  const deal = getDealById(id)

  if (!deal) {
    notFound()
  }

  const activities = getActivitiesByDealId(deal.id)

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/deals/${deal.id}`}
          className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to deal workspace
        </Link>
        <h1 className="text-[32px] font-semibold tracking-tight text-text-primary">
          {deal.name} — Timeline
        </h1>
        <p className="font-mono text-sm text-text-tertiary">{deal.id}</p>
      </div>

      <DealTimeline activities={activities} title="Full deal timeline" />
    </div>
  )
}
