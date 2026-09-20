import Link from 'next/link'
import { APP_NAME, ORG_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

function BrandHouseIcon ({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M16 5.2 4.2 16.2v11.6h23.6V16.2L16 5.2Z"
      />
      <path fill="currentColor" d="M21.4 4.2h4.6v8.2h-4.6z" />
    </svg>
  )
}

export function BrandIcon ({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-md bg-phb-red',
        className
      )}
    >
      <BrandHouseIcon className="size-[1.15rem] text-phb-yellow" />
    </span>
  )
}

export function BrandMark ({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <BrandIcon />
      <span className="min-w-0 leading-none">
        <span className="block text-sm font-semibold text-text-primary">
          {ORG_NAME}
        </span>
        <span className="mt-0.5 block text-xs text-text-secondary">
          {APP_NAME}
        </span>
      </span>
    </Link>
  )
}
