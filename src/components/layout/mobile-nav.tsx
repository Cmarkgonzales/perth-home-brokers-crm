'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { SidebarBrand, SidebarNav } from '@/components/layout/sidebar-nav'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function MobileNav () {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openForPath, setOpenForPath] = useState(pathname)

  if (openForPath !== pathname) {
    setOpenForPath(pathname)
    if (open) setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="gap-0 p-0 data-[side=left]:w-72 data-[side=left]:max-w-[85vw] data-[side=left]:sm:max-w-72"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Command Center navigation</SheetTitle>
        </SheetHeader>
        <SidebarBrand className="pr-12" />
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}
