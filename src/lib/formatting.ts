export function formatCurrency (value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactCurrency (value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    const digits = millions >= 10 ? 0 : 1
    return `$${millions.toFixed(digits)}M`
  }

  if (value >= 1_000) {
    const thousands = value / 1_000
    const digits = thousands >= 10 ? 0 : 1
    return `$${thousands.toFixed(digits)}k`
  }

  return formatCurrency(value)
}

export function formatSignedPercent (value: number): string {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

export function formatCountDelta (delta: number, unit?: string): string {
  if (delta === 0) return 'No change'
  const prefix = delta > 0 ? '+' : ''
  if (!unit) return `${prefix}${delta}`
  const label = Math.abs(delta) === 1 ? unit : `${unit}s`
  return `${prefix}${delta} ${label}`
}

export function formatCurrencyDelta (delta: number): string {
  if (delta === 0) return 'No change'
  const prefix = delta > 0 ? '+' : '−'
  return `${prefix}${formatCompactCurrency(Math.abs(delta))}`
}

export function daysBetween (from: string, to: string): number {
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  const ms = end.getTime() - start.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function formatWaitingLabel (days: number): string {
  if (days <= 0) return 'Due today'
  if (days === 1) return 'Waiting 1 day'
  return `Waiting ${days} days`
}

export function formatIdleLabel (days: number): string {
  if (days <= 0) return 'Active today'
  if (days === 1) return 'No activity for 1 day'
  return `No activity for ${days} days`
}

export function formatDate (date: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getGreeting (): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
