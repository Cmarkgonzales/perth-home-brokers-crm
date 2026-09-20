'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Moon, RotateCcw, Settings, Sun } from 'lucide-react'
import { CURRENT_USER, ORG_NAME } from '@/lib/constants'
import { clearNotificationReadState } from '@/components/layout/notifications-menu'
import { useTheme } from '@/components/layout/theme-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu () {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [resetOpen, setResetOpen] = useState(false)

  function handleResetDemo () {
    clearNotificationReadState()
    setResetOpen(false)
    window.location.reload()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:px-2"
          aria-label="User menu"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-text-primary text-surface">
              {CURRENT_USER.initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline">
            {CURRENT_USER.name}
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground md:inline" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 min-w-56">
          <div className="px-1.5 py-1.5">
            <p className="text-sm font-medium text-text-primary">
              {CURRENT_USER.name}
            </p>
            <p className="text-xs text-text-secondary">{ORG_NAME}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push('/settings')}
          >
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun /> : <Moon />}
            {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setResetOpen(true)}
          >
            <RotateCcw />
            Reset demo data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset demo data?</DialogTitle>
            <DialogDescription>
              This restores the prototype to its initial demo state for this
              browser session. Theme preference is kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" onClick={handleResetDemo}>
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
