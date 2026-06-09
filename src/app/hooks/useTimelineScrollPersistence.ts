import { useApp } from '@/app/hooks/useApp';
import { usePlanning } from '@/app/hooks/usePlanning';
import { ViewType } from '@/app/models/ViewType';
import {
  getStoredTimelineScroll,
  hasStoredTimelineFilters,
  saveTimelineScroll,
  TimelineScrollPosition,
} from '@/app/utils/timelinePersistence';
import { RefObject, useEffect, useRef } from 'react';

const TIMELINE_SCROLL_CONTAINER_ID = 'timeline-scroll-container';
const PERIOD_SELECTOR = '[id^="period-"], #current-period';

function getScrollContainer(
  preferredView: ViewType,
  columnsScrollRef: RefObject<HTMLDivElement | null>,
): HTMLElement | null {
  if (preferredView === ViewType.COLUMNS) {
    return columnsScrollRef.current;
  }
  if (preferredView === ViewType.TIMELINE) {
    return document.getElementById(TIMELINE_SCROLL_CONTAINER_ID);
  }
  return null;
}

function findScrollAnchor(container: HTMLElement, preferredView: ViewType) {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(PERIOD_SELECTOR));
  const containerRect = container.getBoundingClientRect();

  for (const element of elements) {
    const rect = element.getBoundingClientRect();
    const intersects =
      preferredView === ViewType.COLUMNS
        ? rect.right > containerRect.left && rect.left < containerRect.right
        : rect.bottom > containerRect.top && rect.top < containerRect.bottom;

    if (intersects) {
      return {
        id: element.id,
        offsetTop: rect.top - containerRect.top,
        offsetLeft: rect.left - containerRect.left,
      };
    }
  }

  return null;
}

function captureScrollPosition(
  container: HTMLElement,
  preferredView: ViewType,
): TimelineScrollPosition {
  const anchor = findScrollAnchor(container, preferredView);
  return {
    scrollTop: container.scrollTop,
    scrollLeft: container.scrollLeft,
    anchorPeriodId: anchor?.id,
    anchorOffsetTop: anchor?.offsetTop,
    anchorOffsetLeft: anchor?.offsetLeft,
  };
}

function applyScrollPosition(
  container: HTMLElement,
  snapshot: TimelineScrollPosition,
  preferredView: ViewType,
) {
  if (snapshot.anchorPeriodId) {
    const element = document.getElementById(snapshot.anchorPeriodId);
    if (element) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      if (preferredView === ViewType.COLUMNS) {
        const delta =
          elementRect.left - containerRect.left - (snapshot.anchorOffsetLeft ?? 0);
        container.scrollLeft += delta;
      } else {
        const delta =
          elementRect.top - containerRect.top - (snapshot.anchorOffsetTop ?? 0);
        container.scrollTop += delta;
      }
      return;
    }
  }

  container.scrollTop = snapshot.scrollTop;
  container.scrollLeft = snapshot.scrollLeft;
}

function restoreScrollAfterLayout(
  container: HTMLElement,
  snapshot: TimelineScrollPosition,
  preferredView: ViewType,
  onSettled?: () => void,
) {
  let debounceId: ReturnType<typeof setTimeout> | null = null;

  const restore = () => {
    applyScrollPosition(container, snapshot, preferredView);
    onSettled?.();
  };

  const scheduleRestore = () => {
    if (debounceId) clearTimeout(debounceId);
    debounceId = setTimeout(restore, 50);
  };

  requestAnimationFrame(() => {
    restore();
    scheduleRestore();
  });

  const observer = new ResizeObserver(scheduleRestore);
  observer.observe(container);
  if (container.firstElementChild) {
    observer.observe(container.firstElementChild);
  }

  setTimeout(() => {
    observer.disconnect();
    if (debounceId) clearTimeout(debounceId);
  }, 500);
}

function scrollToCurrentPeriod(preferredView: ViewType, currentRangeIndex: number) {
  const targetId =
    preferredView === ViewType.COLUMNS
      ? `period-${currentRangeIndex + 1}`
      : `period-${currentRangeIndex - 1}`;
  const element = document.getElementById(targetId);
  element?.scrollIntoView({ behavior: 'auto', block: 'start' });
}

interface Options {
  columnsScrollRef: RefObject<HTMLDivElement | null>;
  isReady: boolean;
  isFetching: boolean;
  currentRangeIndex: number;
}

export function useTimelineScrollPersistence({
  columnsScrollRef,
  isReady,
  isFetching,
  currentRangeIndex,
}: Options) {
  const { preferredView } = useApp();
  const { selectedPlanning } = usePlanning();
  const planningId = selectedPlanning?.id ?? '';
  const hasInitializedRef = useRef(false);
  const scrollSnapshotRef = useRef<TimelineScrollPosition | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistScroll = (container: HTMLElement) => {
    if (!planningId) return;
    saveTimelineScroll(
      planningId,
      preferredView,
      captureScrollPosition(container, preferredView),
    );
  };

  useEffect(() => {
    hasInitializedRef.current = false;
  }, [planningId, preferredView]);

  useEffect(() => {
    if (!planningId || !isReady) return;

    const container = getScrollContainer(preferredView, columnsScrollRef);
    if (!container) return;

    const onScroll = () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => persistScroll(container), 150);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [planningId, preferredView, isReady, columnsScrollRef]);

  useEffect(() => {
    if (!planningId) return;

    const container = getScrollContainer(preferredView, columnsScrollRef);
    if (!container) return;

    if (isFetching) {
      scrollSnapshotRef.current = captureScrollPosition(container, preferredView);
      return;
    }

    if (scrollSnapshotRef.current && hasInitializedRef.current) {
      const snapshot = scrollSnapshotRef.current;
      scrollSnapshotRef.current = null;
      restoreScrollAfterLayout(container, snapshot, preferredView, () => {
        persistScroll(container);
      });
    }
  }, [isFetching, planningId, preferredView, columnsScrollRef]);

  useEffect(() => {
    if (!planningId || !isReady || hasInitializedRef.current) return;

    const container = getScrollContainer(preferredView, columnsScrollRef);
    if (!container) return;

    const stored = getStoredTimelineScroll(planningId, preferredView);

    const applyInitialScroll = () => {
      if (stored) {
        restoreScrollAfterLayout(container, stored, preferredView);
      } else if (!hasStoredTimelineFilters(planningId) && currentRangeIndex !== -1) {
        scrollToCurrentPeriod(preferredView, currentRangeIndex);
        persistScroll(container);
      }
      hasInitializedRef.current = true;
    };

    const timeoutId = setTimeout(applyInitialScroll, 100);
    return () => clearTimeout(timeoutId);
  }, [planningId, preferredView, isReady, currentRangeIndex, columnsScrollRef]);
}

export { TIMELINE_SCROLL_CONTAINER_ID };
