import { useState, useEffect, useCallback } from 'react';
import { localStorageKeys } from '../config/localStorageKeys';
import { ViewType } from '../models/ViewType';

export function usePreferredView() {
  const [preferredView, setPreferredView] = useState<ViewType>(() => {
    const storedView = localStorage.getItem(localStorageKeys.PREFERRED_VIEW);
    return (storedView as ViewType) || ViewType.COLUMNS;
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