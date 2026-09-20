import { SidebarNav } from '@/components/layout/sidebar-nav'

interface SidebarProps {
  pendingApprovalCount?: number
}

export function Sidebar ({ pendingApprovalCount }: SidebarProps) {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <SidebarNav pendingApprovalCount={pendingApprovalCount} />
    </aside>
  )
}
