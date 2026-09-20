import { BrandMark } from '@/components/layout/brand-mark'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export function AppShell ({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <div className="relative z-20 flex h-14 min-h-14 shrink-0 border-b border-border bg-surface">
        <div className="hidden w-60 shrink-0 items-center border-r border-border px-4 lg:flex">
          <BrandMark />
        </div>
        <Topbar />
      </div>
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
