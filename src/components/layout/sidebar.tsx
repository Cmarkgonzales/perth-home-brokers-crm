import { SidebarBrand, SidebarNav } from '@/components/layout/sidebar-nav'

export function Sidebar () {
  return (
    <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-sidebar-border bg-surface lg:flex">
      <SidebarBrand />
      <SidebarNav />
    </aside>
  )
}
