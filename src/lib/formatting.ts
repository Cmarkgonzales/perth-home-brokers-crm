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
  }).format(new Date(`${date}T00:00:00`))
}

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export function formatCompactDate (date: string, today: string): string {
  if (date === today) return 'Today'

  const parts = date.split('-')
  const monthIndex = Number(parts[1]) - 1
  const day = Number(parts[2])
  const month = SHORT_MONTHS[monthIndex]

  if (!month || Number.isNaN(day)) return date
  return `${day} ${month}`
}

export function formatMonthDay (date: string): string {
  const parts = date.split('-')
  const month = SHORT_MONTHS[Number(parts[1]) - 1]
  const day = Number(parts[2])

  if (!month || Number.isNaN(day)) return date
  return `${month} ${String(day).padStart(2, '0')}`
}

export function getInitials (name: string): string {
  const parts = name
    .replace(/[^A-Za-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function getGreeting (): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
