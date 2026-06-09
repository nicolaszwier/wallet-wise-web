import { localStorageKeys } from '@/app/config/localStorageKeys';
import { PeriodRequestFilters } from '@/services/periodsService';
import { ViewType } from '@/app/models/ViewType';
import { getRelativeDate } from './date';
import { QueryClient } from '@tanstack/react-query';

export interface TimelineScrollPosition {
  scrollTop: number;
  scrollLeft: number;
  anchorPeriodId?: string;
  anchorOffsetTop?: number;
  anchorOffsetLeft?: number;
}

export function getDefaultTimelineFilters(): PeriodRequestFilters {
  return {
    sortOrder: 'desc',
    startDate: getRelativeDate(new Date(), -2, 'month').toISOString(),
    endDate: getRelativeDate(new Date(), 3, 'month').toISOString(),
  };
}

function filtersKey(planningId: string) {
  return `${localStorageKeys.TIMELINE_FILTERS}:${planningId}`;
}

function scrollKey(planningId: string, viewType: ViewType) {
  return `${localStorageKeys.TIMELINE_SCROLL}:${planningId}:${viewType}`;
}

export function getStoredTimelineFilters(planningId: string): PeriodRequestFilters | null {
  try {
    const raw = localStorage.getItem(filtersKey(planningId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PeriodRequestFilters;
    if (!parsed.startDate || !parsed.endDate || !parsed.sortOrder) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTimelineFilters(planningId: string, filters: PeriodRequestFilters) {
  localStorage.setItem(filtersKey(planningId), JSON.stringify(filters));
}

export function getStoredTimelineScroll(
  planningId: string,
  viewType: ViewType,
): TimelineScrollPosition | null {
  try {
    const raw = localStorage.getItem(scrollKey(planningId, viewType));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TimelineScrollPosition;
    if (typeof parsed.scrollTop !== 'number' || typeof parsed.scrollLeft !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTimelineScroll(
  planningId: string,
  viewType: ViewType,
  position: TimelineScrollPosition,
) {
  localStorage.setItem(scrollKey(planningId, viewType), JSON.stringify(position));
}

export function clearTimelineScroll(planningId: string, viewType?: ViewType) {
  if (viewType) {
    localStorage.removeItem(scrollKey(planningId, viewType));
    return;
  }
  Object.values(ViewType).forEach((view) => {
    localStorage.removeItem(scrollKey(planningId, view));
  });
}

export function hasStoredTimelineFilters(planningId: string) {
  return getStoredTimelineFilters(planningId) !== null;
}

function getStoredPlanningId(): string | undefined {
  try {
    const raw = localStorage.getItem(localStorageKeys.SELECTED_PLANNING);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed.id;
  } catch {
    return undefined;
  }
}

export function getInitialTimelineFilters(planningId?: string): PeriodRequestFilters {
  const id = planningId ?? getStoredPlanningId();
  if (id) {
    const stored = getStoredTimelineFilters(id);
    if (stored) return stored;
  }
  return getDefaultTimelineFilters();
}

export function getPeriodsQueryKey(planningId: string, filters: PeriodRequestFilters) {
  return ['periods', planningId, filters.startDate, filters.endDate, filters.sortOrder] as const;
}

export function resolveTimelineFilters(
  planningId: string,
  filters?: PeriodRequestFilters,
): PeriodRequestFilters {
  return filters ?? getStoredTimelineFilters(planningId) ?? getDefaultTimelineFilters();
}

export function invalidatePeriodsQueries(
  queryClient: QueryClient,
  planningId: string,
  filters?: PeriodRequestFilters,
) {
  const resolved = resolveTimelineFilters(planningId, filters);
  return queryClient.invalidateQueries({
    queryKey: getPeriodsQueryKey(planningId, resolved),
  });
}
