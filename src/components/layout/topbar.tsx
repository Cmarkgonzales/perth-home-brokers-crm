import { Bell, Search } from 'lucide-react'
import { APP_NAME, CURRENT_USER } from '@/lib/constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Topbar () {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-6">
      <h1 className="text-base font-semibold tracking-tight">{APP_NAME}</h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deals, clients..."
            className="h-8 w-64 pl-8"
          />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <Avatar size="sm">
          <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
