import { demoClients, getDashboardSnapshot } from '@/data/demo'
import { getGreeting } from '@/lib/formatting'
import { pageTitleClass } from '@/components/layout/page-header'
import { AiBusinessBriefCompact } from '@/components/dashboard/ai-business-brief-compact'
import { BookHealth } from '@/components/dashboard/book-health'
import { ComingUpList } from '@/components/dashboard/coming-up-list'
import { MoneyStrip } from '@/components/dashboard/money-strip'
import { NewEnquiries } from '@/components/dashboard/new-enquiries'
import { StalledDealsTable } from '@/components/dashboard/stalled-deals-table'
import { NewDealDialog } from '@/components/deals/new-deal-dialog'

export const dynamic = 'force-dynamic'

export default function DashboardPage () {
  const snapshot = getDashboardSnapshot()

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className={pageTitleClass} suppressHydrationWarning>
            {getGreeting()}, {snapshot.greetingName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {snapshot.periodLabel} book
          </p>
        </div>
        <NewDealDialog clients={demoClients} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_min(100%,20rem)] lg:items-start lg:gap-6">
        <div className="order-2 min-w-0 space-y-4 lg:order-1">
          <MoneyStrip metrics={snapshot.money} compact />
          <StalledDealsTable rows={snapshot.stalledDeals} />
          <div className="grid gap-4 md:grid-cols-2">
            <NewEnquiries
              enquiries={snapshot.enquiries}
              total={snapshot.newEnquiriesTotal}
            />
            <ComingUpList items={snapshot.comingUp} />
          </div>
        </div>

        <aside className="order-1 min-w-0 space-y-4 lg:order-2">
          <AiBusinessBriefCompact briefing={snapshot.briefing} />
          <BookHealth book={snapshot.book} brokers={snapshot.brokers} />
        </aside>
      </div>
    </div>
  )
}