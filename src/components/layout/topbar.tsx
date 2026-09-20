'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Sparkles } from 'lucide-react'
import { BrandIcon } from '@/components/layout/brand-mark'
import { CrmSearch } from '@/components/layout/crm-search'
import { MobileNav } from '@/components/layout/mobile-nav'
import { NotificationsMenu } from '@/components/layout/notifications-menu'
import { UserMenu } from '@/components/layout/user-menu'
import { Button, ButtonLink } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface TopbarProps {
  pendingApprovalCount?: number
}

export function Topbar ({ pendingApprovalCount }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="flex h-full min-w-0 flex-1 items-center gap-2 bg-surface px-3 sm:gap-4 sm:px-4 lg:px-6">
      <MobileNav pendingApprovalCount={pendingApprovalCount} />

      <Link
        href="/dashboard"
        className="cursor-pointer lg:hidden"
        aria-label="Perth Home Brokers Command Center"
      >
        <BrandIcon />
      </Link>

      <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-xl">
        <CrmSearch />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search leads, clients and deals"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="size-4" />
        </Button>

        <ButtonLink
          href="/ai"
          variant="ghost"
          size="icon"
          aria-label="AI Copilot"
        >
          <Sparkles className="size-4 text-phb-yellow-dark" />
        </ButtonLink>

        <NotificationsMenu />
        <UserMenu />
      </div>

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="gap-3 p-4">
          <SheetHeader className="p-0">
            <SheetTitle>Search leads, clients and deals</SheetTitle>
          </SheetHeader>
          <CrmSearch
            autoFocus={searchOpen}
            layout="inline"
            onNavigate={() => setSearchOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </header>
  )
}
