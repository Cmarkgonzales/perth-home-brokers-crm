import { formatCurrency } from '@/lib/formatting'

export function formatDealBudgetHint (
  clientBudget: number,
  templateTotal: number
): string {
  const delta = clientBudget - templateTotal
  if (delta >= 0) {
    return `${formatCurrency(delta)} under budget`
  }
  return `${formatCurrency(Math.abs(delta))} over budget`
}
