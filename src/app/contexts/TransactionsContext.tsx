import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Transaction } from "../models/Transaction";
import { PeriodRequestFilters } from "@/services/periodsService";
import {
  getDefaultTimelineFilters,
  getInitialTimelineFilters,
  getStoredTimelineFilters,
  saveTimelineFilters,
} from "../utils/timelinePersistence";
import { usePlanning } from "../hooks/usePlanning";

interface TransactionsContextValue {
  filters: PeriodRequestFilters
  filtersHydrated: boolean;
  isSelectionMode: boolean;
  selectedTransactionsTotal: number;
  selectedTransactions: Transaction[];
  activeTransaction: null | Transaction;
  isFilterTransactionsDialogOpen: boolean;
  isPayTransactionDialogOpen: boolean;
  isDeleteTransactionDialogOpen: boolean;
  isEditTransactionDialogOpen: boolean;
  showEmptyPeriods: boolean;
  setFilters: Dispatch<SetStateAction<PeriodRequestFilters>>,
  setActiveTransaction(transaction: null | Transaction): void
  toggleFilterTransactionsDialog: Dispatch<SetStateAction<boolean>>,
  togglePayTransactionDialog: Dispatch<SetStateAction<boolean>>,
  toggleDeleteTransactionDialog: Dispatch<SetStateAction<boolean>>,
  toggleEditTransactionDialog: Dispatch<SetStateAction<boolean>>,
  toggleShowEmptyPeriods(): void,
  selectTransaction(transaction: Transaction): void;
  clearSelectedTransactions(): void;
}

export const TransactionsContext = createContext({} as TransactionsContextValue);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const { selectedPlanning } = usePlanning();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionsTotal, setSelectedTransactionsTotal] = useState(0);
  const [isPayTransactionDialogOpen, setIsPayTransactionDialogOpen] = useState(false);
  const [isDeleteTransactionDialogOpen, setIsDeleteTransactionDialogOpen] = useState(false);
  const [isEditTransactionDialogOpen, setIsEditTransactionDialogOpen] = useState(false);
  const [isFilterTransactionsDialogOpen, setIsFilterTransactionsDialogOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<null | Transaction>(null);
  const [showEmptyPeriods, setShowEmptyPeriods] = useState<boolean>(true);
  const [filters, setFilters] = useState<PeriodRequestFilters>(() =>
    getInitialTimelineFilters(selectedPlanning?.id),
  );
  const [filtersHydrated, setFiltersHydrated] = useState(() => !!selectedPlanning?.id);

  useEffect(() => {
    if (!selectedPlanning?.id) {
      setFiltersHydrated(false);
      return;
    }
    const stored = getStoredTimelineFilters(selectedPlanning.id);
    setFilters(stored ?? getDefaultTimelineFilters());
    setFiltersHydrated(true);
  }, [selectedPlanning?.id]);

  useEffect(() => {
    if (!selectedPlanning?.id || !filtersHydrated) return;
    saveTimelineFilters(selectedPlanning.id, filters);
  }, [filters, selectedPlanning?.id, filtersHydrated]);

  const selectTransaction = (transaction: Transaction) => {
    setSelectedTransactions(prevState => {
      const isSelected = prevState.some(item => item.id === transaction.id);
      let result: Transaction[] 
      if (isSelected) {
        result = prevState.filter(item => item.id !== transaction.id);
      } else {
        result = [...prevState, transaction];
      }
      toggleSelectionMode(result.length);

      return result;
    });
  }

  useEffect(()=> {
    console.log({activeTransaction})
  }, [activeTransaction])

  useEffect(() => {
    const total = selectedTransactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);
    setSelectedTransactionsTotal(total);
  }, [selectedTransactions]);

  const toggleSelectionMode = (count: number) => {
    if (count > 0) {
      setIsSelectionMode(true)
    } else {
      setIsSelectionMode(false)
    }
  };
 
  const toggleShowEmptyPeriods = () => {
    setShowEmptyPeriods(prev => !prev);
  };

  const clearSelectedTransactions = useCallback(() => {
    setSelectedTransactions([]);
    setIsSelectionMode(false);
    setSelectedTransactionsTotal(0);
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        filters,
        filtersHydrated,
        selectedTransactions,
        activeTransaction,
        isSelectionMode,
        selectedTransactionsTotal,
        isPayTransactionDialogOpen,
        isDeleteTransactionDialogOpen,
        isEditTransactionDialogOpen,
        isFilterTransactionsDialogOpen,
        showEmptyPeriods,
        toggleShowEmptyPeriods,
        setFilters,
        selectTransaction,
        setActiveTransaction,
        clearSelectedTransactions,
        togglePayTransactionDialog: setIsPayTransactionDialogOpen,
        toggleDeleteTransactionDialog: setIsDeleteTransactionDialogOpen,
        toggleEditTransactionDialog: setIsEditTransactionDialogOpen,
        toggleFilterTransactionsDialog: setIsFilterTransactionsDialogOpen
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
