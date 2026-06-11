import { useCallback, useSyncExternalStore } from 'react';
import { localStorageKeys } from '../config/localStorageKeys';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('pending-first-transaction-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('pending-first-transaction-change', callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(localStorageKeys.PENDING_FIRST_TRANSACTION) === 'true';
}

function getServerSnapshot() {
  return false;
}

function notifyChange() {
  window.dispatchEvent(new Event('pending-first-transaction-change'));
}

export function usePendingFirstTransaction() {
  const isPending = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setPending = useCallback(() => {
    localStorage.setItem(localStorageKeys.PENDING_FIRST_TRANSACTION, 'true');
    notifyChange();
  }, []);

  const clearPending = useCallback(() => {
    localStorage.removeItem(localStorageKeys.PENDING_FIRST_TRANSACTION);
    notifyChange();
  }, []);

  return { isPending, setPending, clearPending };
}
