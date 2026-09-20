'use client'

import { useState } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { CURRENT_USER } from '@/lib/constants'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

function SearchField () {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search CRM..."
        className="h-9 bg-app-background pl-8"
        aria-label="Search CRM"
      />
    </div>
  )
}

export function Topbar () {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:gap-4 sm:px-4 lg:px-6">
      <MobileNav />

      <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-md">
        <SearchField />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search CRM"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="size-4" />
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:px-2"
            aria-label="User menu"
          >
            <Avatar size="sm">
              <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:inline">
              {CURRENT_USER.name}
            </span>
            <ChevronDown className="hidden size-4 text-muted-foreground md:inline" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="font-medium">{CURRENT_USER.name}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {CURRENT_USER.role}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="gap-3 p-4">
          <SheetHeader className="p-0">
            <SheetTitle>Search CRM</SheetTitle>
          </SheetHeader>
          <SearchField />
        </SheetContent>
      </Sheet>
    </header>
  )
}
