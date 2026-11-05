import Image from 'next/image'
import type { ResolvedPackageTemplate } from '@/domain/packages/package-template-utils'
import { MapPin } from 'lucide-react'

interface PackageTemplatePreviewProps {
  template: ResolvedPackageTemplate
}

function HouseFacadeIllustration () {
  return (
    <svg
      viewBox="0 0 120 72"
      className="h-16 w-auto text-text-primary/90"
      aria-hidden
    >
      <polygon
        points="60,8 104,36 16,36"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="28"
        y="36"
        width="64"
        height="32"
        rx="2"
        fill="currentColor"
        opacity="0.08"
      />
      <rect
        x="28"
        y="36"
        width="64"
        height="32"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <rect
        x="52"
        y="48"
        width="16"
        height="20"
        rx="1"
        className="fill-phb-red"
        opacity="0.85"
      />
      <rect x="36" y="44" width="12" height="10" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="72" y="44" width="12" height="10" rx="1" fill="currentColor" opacity="0.15" />
    </svg>
  )
}

export function PackageTemplatePreview ({
  template,
}: PackageTemplatePreviewProps) {
  const { design, land } = template

  const label = `${design.name} on ${land.name}, ${land.suburb}`

  if (design.imageUrl) {
    return (
      <div className="relative h-28 overflow-hidden bg-surface-muted">
        <Image
          src={design.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-text-primary/60 to-transparent"
          aria-hidden
        />
        <p className="absolute inset-x-3 bottom-2 truncate text-xs font-medium text-white drop-shadow-sm">
          {land.name}
        </p>
      </div>
    )
  }

  return (
    <div
      className="relative h-28 overflow-hidden bg-gradient-to-b from-surface-strong via-surface-muted to-success/15"
      aria-label={label}
    >
      <div className="absolute inset-x-3 top-3 z-10 min-w-0">
        <p className="truncate text-xs font-semibold text-text-primary">
          {design.name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-text-secondary">
          <MapPin className="size-3 shrink-0 text-phb-red" aria-hidden />
          <span className="truncate">{land.name}</span>
        </p>
      </div>

      <span className="absolute top-3 right-3 z-10 rounded-full border border-border bg-surface/90 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-primary">
        {design.houseWidth}m
      </span>

      <div className="absolute inset-x-0 bottom-2 flex justify-center">
        <HouseFacadeIllustration />
      </div>
    </div>
  )
}
