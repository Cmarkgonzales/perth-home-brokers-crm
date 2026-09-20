import type { DealStage } from '@/domain/deals/deal.types'

export const DEAL_STAGES: DealStage[] = [
  'lead',
  'qualified',
  'finance',
  'land',
  'builder',
  'package',
  'drafting',
  'approval',
  'construction',
  'settlement',
]

export function getStageIndex (stage: DealStage): number {
  return DEAL_STAGES.indexOf(stage)
}

export function isStageCompleted (
  currentStage: DealStage,
  targetStage: DealStage
): boolean {
  return getStageIndex(currentStage) > getStageIndex(targetStage)
}

export function isStageCurrent (
  currentStage: DealStage,
  targetStage: DealStage
): boolean {
  return currentStage === targetStage
}

export function isStageFuture (
  currentStage: DealStage,
  targetStage: DealStage
): boolean {
  return getStageIndex(currentStage) < getStageIndex(targetStage)
}

export function getStageProgress (stage: DealStage): number {
  const index = getStageIndex(stage)
  if (index < 0) return 0
  return Math.round(((index + 1) / DEAL_STAGES.length) * 100)
}
