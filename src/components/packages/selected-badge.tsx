import { Check } from 'lucide-react'

export function SelectedBadge () {
  return (
    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-phb-yellow px-2 py-0.5 text-xs font-medium text-text-primary">
      <Check className="size-3" aria-hidden />
      Selected
    </span>
  )
}
