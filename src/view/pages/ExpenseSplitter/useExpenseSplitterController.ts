import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { usePlanning } from '@/app/hooks/usePlanning';
import { localStorageKeys } from '@/app/config/localStorageKeys';
import {
  SplitExpense,
  SplitParticipant,
  SplitSession,
  SplitSessionStore,
} from '@/app/models/ExpenseSplitter';
import {
  calculateBalances,
  calculateSettlements,
  canShowResults,
} from '@/app/utils/expenseSplitter';

function generateId(): string {
  return crypto.randomUUID();
}

function createEmptySession(name: string, currency: string, user?: { name: string; email: string }): SplitSession {
  const participants: SplitParticipant[] = user
    ? [{ id: generateId(), name: user.name, linkedUserId: user.email }]
    : [];

  return {
    id: generateId(),
    name,
    currency,
    participants,
    expenses: [],
    updatedAt: new Date().toISOString(),
  };
}

function loadStore(): SplitSessionStore | null {
  try {
    const raw = localStorage.getItem(localStorageKeys.EXPENSE_SPLITTER_SESSIONS);
    if (!raw) return null;
    return JSON.parse(raw) as SplitSessionStore;
  } catch {
    return null;
  }
}

function saveStore(store: SplitSessionStore) {
  localStorage.setItem(localStorageKeys.EXPENSE_SPLITTER_SESSIONS, JSON.stringify(store));
}

export function useExpenseSplitterController() {
  const { signedIn, user } = useAuth();
  const { selectedPlanning } = usePlanning();
  const defaultCurrency = selectedPlanning?.currency ?? 'BRL';

  const [store, setStore] = useState<SplitSessionStore>(() => {
    const loaded = loadStore();
    if (loaded && loaded.sessions.length > 0) return loaded;
    const session = createEmptySession('New split', defaultCurrency);
    return { activeSessionId: session.id, sessions: [session] };
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveStore(store), 300);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [store]);

  const activeSession = useMemo(
    () => store.sessions.find((s) => s.id === store.activeSessionId) ?? store.sessions[0],
    [store],
  );

  const updateActiveSession = useCallback((updater: (session: SplitSession) => SplitSession) => {
    setStore((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === prev.activeSessionId
          ? { ...updater(s), updatedAt: new Date().toISOString() }
          : s,
      ),
    }));
  }, []);

  const createSession = useCallback(
    (name: string) => {
      const session = createEmptySession(
        name,
        defaultCurrency,
        signedIn && user ? { name: user.name, email: user.email } : undefined,
      );
      setStore((prev) => ({
        activeSessionId: session.id,
        sessions: [...prev.sessions, session],
      }));
    },
    [defaultCurrency, signedIn, user],
  );

  const switchSession = useCallback((sessionId: string) => {
    setStore((prev) => ({ ...prev, activeSessionId: sessionId }));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setStore((prev) => {
      const remaining = prev.sessions.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const session = createEmptySession('New split', defaultCurrency);
        return { activeSessionId: session.id, sessions: [session] };
      }
      return {
        activeSessionId:
          prev.activeSessionId === sessionId ? remaining[0].id : prev.activeSessionId,
        sessions: remaining,
      };
    });
  }, [defaultCurrency]);

  const renameSession = useCallback(
    (name: string) => updateActiveSession((s) => ({ ...s, name })),
    [updateActiveSession],
  );

  const setCurrency = useCallback(
    (currency: string) => updateActiveSession((s) => ({ ...s, currency })),
    [updateActiveSession],
  );

  const addParticipant = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      updateActiveSession((s) => ({
        ...s,
        participants: [...s.participants, { id: generateId(), name: trimmed }],
      }));
    },
    [updateActiveSession],
  );

  const removeParticipant = useCallback(
    (participantId: string) => {
      updateActiveSession((s) => ({
        ...s,
        participants: s.participants.filter((p) => p.id !== participantId),
        expenses: s.expenses.filter((e) => e.payerId !== participantId),
      }));
    },
    [updateActiveSession],
  );

  const addExpense = useCallback(
    (expense: Omit<SplitExpense, 'id'>) => {
      updateActiveSession((s) => ({
        ...s,
        expenses: [...s.expenses, { ...expense, id: generateId() }],
      }));
    },
    [updateActiveSession],
  );

  const updateExpense = useCallback(
    (expenseId: string, expense: Omit<SplitExpense, 'id'>) => {
      updateActiveSession((s) => ({
        ...s,
        expenses: s.expenses.map((e) => (e.id === expenseId ? { ...expense, id: expenseId } : e)),
      }));
    },
    [updateActiveSession],
  );

  const removeExpense = useCallback(
    (expenseId: string) => {
      updateActiveSession((s) => ({
        ...s,
        expenses: s.expenses.filter((e) => e.id !== expenseId),
      }));
    },
    [updateActiveSession],
  );

  const markExpenseExported = useCallback(
    (expenseId: string) => {
      updateActiveSession((s) => ({
        ...s,
        expenses: s.expenses.map((e) =>
          e.id === expenseId ? { ...e, exportedTransactionId: 'exported' } : e,
        ),
      }));
    },
    [updateActiveSession],
  );

  const toggleSettlementPaid = useCallback(
    (settlementKey: string) => {
      updateActiveSession((s) => {
        const paidKeys = s.paidSettlementKeys ?? [];
        const isPaid = paidKeys.includes(settlementKey);
        return {
          ...s,
          paidSettlementKeys: isPaid
            ? paidKeys.filter((key) => key !== settlementKey)
            : [...paidKeys, settlementKey],
        };
      });
    },
    [updateActiveSession],
  );

  const markSettlementExported = useCallback(
    (settlementKey: string) => {
      updateActiveSession((s) => {
        const exportedKeys = s.exportedSettlementKeys ?? [];
        if (exportedKeys.includes(settlementKey)) return s;
        return {
          ...s,
          exportedSettlementKeys: [...exportedKeys, settlementKey],
        };
      });
    },
    [updateActiveSession],
  );

  const currentUserParticipant = useMemo(
    () =>
      signedIn && user
        ? activeSession.participants.find((p) => p.linkedUserId === user.email)
        : undefined,
    [signedIn, user, activeSession.participants],
  );

  const myExpenses = useMemo(
    () =>
      currentUserParticipant
        ? activeSession.expenses.filter((e) => e.payerId === currentUserParticipant.id)
        : [],
    [currentUserParticipant, activeSession.expenses],
  );

  const balances = useMemo(
    () => calculateBalances(activeSession.participants, activeSession.expenses),
    [activeSession.participants, activeSession.expenses],
  );

  const settlements = useMemo(
    () => calculateSettlements(activeSession.participants, activeSession.expenses),
    [activeSession.participants, activeSession.expenses],
  );

  const myDebts = useMemo(
    () =>
      currentUserParticipant
        ? settlements.filter((s) => s.fromId === currentUserParticipant.id)
        : [],
    [currentUserParticipant, settlements],
  );

  const owedToMe = useMemo(
    () =>
      currentUserParticipant
        ? settlements.filter((s) => s.toId === currentUserParticipant.id)
        : [],
    [currentUserParticipant, settlements],
  );

  const showResults = canShowResults(activeSession.participants);

  return {
    store,
    activeSession,
    signedIn,
    user,
    currentUserParticipant,
    myExpenses,
    myDebts,
    owedToMe,
    balances,
    settlements,
    showResults,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    setCurrency,
    addParticipant,
    removeParticipant,
    addExpense,
    updateExpense,
    removeExpense,
    markExpenseExported,
    markSettlementExported,
    toggleSettlementPaid,
  };
}
