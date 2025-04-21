import { useState, useEffect, useCallback } from 'react';
import { localStorageKeys } from '../config/localStorageKeys';
import { ViewType } from '../models/ViewType';
import { useIsMobile } from './useIsMobile';

export function usePreferredView() {
  const isMobile = useIsMobile()
  const [preferredView, setPreferredView] = useState<ViewType>(() => {
    const storedView = localStorage.getItem(localStorageKeys.PREFERRED_VIEW); 
    if (!storedView) {
      return isMobile ? ViewType.TIMELINE : ViewType.COLUMNS;
    } 
    return (storedView as ViewType);
  });

  const changePreferredView = useCallback((view: ViewType) => {
    setPreferredView(view);
    localStorage.setItem(localStorageKeys.PREFERRED_VIEW, view);
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKeys.PREFERRED_VIEW, preferredView);
  }, [preferredView]);

  return {
    preferredView,
    changePreferredView,
  };
}