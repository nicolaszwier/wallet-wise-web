import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { screenNameFromPath } from './events';
import { analytics } from './track';

export function useRouteAnalytics(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    analytics.screenViewed(screenNameFromPath(pathname));
  }, [pathname]);
}
