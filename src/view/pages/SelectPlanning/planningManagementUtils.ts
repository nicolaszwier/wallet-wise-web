import { Planning } from '@/app/models/Planning';

export function canDeletePlanning(plannings: Planning[], planning: Planning) {
  return plannings.length > 1 && !planning.isDefault;
}

export function resolveNextSelectedPlanning(
  plannings: Planning[],
  deletedPlanningId: string,
): Planning | undefined {
  const remaining = plannings.filter((planning) => planning.id !== deletedPlanningId);

  if (remaining.length === 0) {
    return undefined;
  }

  return remaining.find((planning) => planning.isDefault) ?? remaining[0];
}

export function getInitialPlanningCurrency(language: string, planning?: Planning) {
  if (planning?.currency) return planning.currency;
  if (language.startsWith('pt')) return 'BRL';
  return 'USD';
}
