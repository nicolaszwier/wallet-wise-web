import { useCallback } from 'react';
import { localStorageKeys } from '../config/localStorageKeys';

export function useOnboarding() {
  const isCompleted = useCallback(() => {
    return localStorage.getItem(localStorageKeys.ONBOARDING_COMPLETED) === 'true';
  }, []);

  const markCompleted = useCallback(() => {
    localStorage.setItem(localStorageKeys.ONBOARDING_COMPLETED, 'true');
  }, []);

  return { isCompleted, markCompleted };
}
