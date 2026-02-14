import { ViewType } from "@/app/models/ViewType";
import { useCallback, useEffect, useRef, useState } from "react";

const CURRENT_PERIOD_ID = "current-period";

/**
 * Find the scroll container: first ancestor with overflow scroll/auto that actually has scrollable content.
 */
function getScrollParent(el: Element): Element | null {
  let parent = el.parentElement;
  while (parent) {
    const { overflowY, overflowX, overflow } = getComputedStyle(parent);
    const hasOverflow =
      ["auto", "scroll", "overlay"].includes(overflowY) ||
      ["auto", "scroll", "overlay"].includes(overflowX) ||
      (overflow !== "visible" && ["auto", "scroll", "overlay"].includes(overflow));
    const canScrollY = parent.scrollHeight > parent.clientHeight;
    if (hasOverflow && canScrollY) return parent;
    parent = parent.parentElement;
  }
  return null;
}

/** 'down' = scroll position is above current period (show arrow down). 'up' = scroll position is below (show arrow up). */
export type ScrollToCurrentDirection = "down" | "up";

function computeVisibilityAndDirection(
  el: Element,
  scrollRoot: Element | null
): { visible: boolean; direction: ScrollToCurrentDirection | null } {
  const rect = el.getBoundingClientRect();
  const rootBounds = scrollRoot
    ? scrollRoot.getBoundingClientRect()
    : {
        top: 0,
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth,
      };

  const visible =
    rect.top < rootBounds.bottom && rect.bottom > rootBounds.top;
  if (visible) return { visible: true, direction: null };

  if (rect.top >= rootBounds.bottom) {
    return { visible: false, direction: "down" };
  }
  if (rect.bottom <= rootBounds.top) {
    return { visible: false, direction: "up" };
  }
  return { visible: false, direction: "down" };
}

/**
 * Observes the #current-period element and returns whether it is visible in its scroll container
 * and, when not visible, whether we're above or below it (for showing the correct arrow icon).
 * Only runs when preferredView is TIMELINE or COLUMNS (views that render the current-period element).
 */
export function useCurrentPeriodInView(preferredView: ViewType) {
  const [isCurrentPeriodVisible, setIsCurrentPeriodVisible] = useState(true);
  const [scrollDirection, setScrollDirection] =
    useState<ScrollToCurrentDirection | null>(null);
  const scrollRootRef = useRef<Element | null>(null);

  const scrollToCurrentPeriod = useCallback(() => {
    document.getElementById(CURRENT_PERIOD_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    if (
      preferredView !== ViewType.TIMELINE &&
      preferredView !== ViewType.COLUMNS
    ) {
      return;
    }

    let cancelled = false;
    let rafId: number;
    let observer: IntersectionObserver | null = null;
    let scrollRoot: Element | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const updateState = (el: Element, root: Element | null) => {
      const { visible, direction } = computeVisibilityAndDirection(el, root);
      if (!cancelled) {
        setIsCurrentPeriodVisible(visible);
        setScrollDirection(direction);
      }
    };

    const onScrollOrResize = () => {
      if (cancelled) return;
      rafId = requestAnimationFrame(() => {
        const el = document.getElementById(CURRENT_PERIOD_ID);
        if (el) updateState(el, scrollRoot);
      });
    };

    const tryAttach = (): boolean => {
      const el = document.getElementById(CURRENT_PERIOD_ID);
      if (!el || cancelled) return false;

      const root = getScrollParent(el);
      scrollRoot = root;
      scrollRootRef.current = root;

      root?.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize);

      updateState(el, root);

      observer = new IntersectionObserver(
        ([entry]) => {
          if (cancelled) return;
          const target = entry.target as Element;
          const rootForEntry = scrollRoot ?? getScrollParent(target);
          updateState(target, rootForEntry);
        },
        { threshold: 0, root: root ?? undefined }
      );
      observer.observe(el);
      return true;
    };

    if (!tryAttach()) {
      intervalId = setInterval(() => {
        if (tryAttach() && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 400);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      observer?.disconnect();
      scrollRoot?.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(rafId);
    };
  }, [preferredView]);

  return { isCurrentPeriodVisible, scrollDirection, scrollToCurrentPeriod };
}
