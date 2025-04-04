import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Transaction } from "../models/Transaction";

interface TransactionsContextValue {
  isSelectionMode: boolean;
  selectedTransactionsTotal: number;
  selectedTransactions: Transaction[];
  activeTransaction: null | Transaction;
  isPayTransactionDialogOpen: boolean;
  isEditTransactionDialogOpen: boolean;
  setActiveTransaction(transaction: null | Transaction): void
  togglePayTransactionDialog: Dispatch<SetStateAction<boolean>>,
  toggleEditTransactionDialog: Dispatch<SetStateAction<boolean>>,
  selectTransaction(transaction: Transaction): void;
  clearSelectedTransactions(): void;
}

export const TransactionsContext = createContext({} as TransactionsContextValue);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [selectedTransactionsTotal, setSelectedTransactionsTotal] = useState(0);
  const [isPayTransactionDialogOpen, setIsPayTransactionDialogOpen] = useState(false);
  const [isEditTransactionDialogOpen, setIsEditTransactionDialogOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<null | Transaction>(null);

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

  const clearSelectedTransactions = useCallback(() => {
    setSelectedTransactions([]);
    setIsSelectionMode(false);
    setSelectedTransactionsTotal(0);
  }, []);

  // const openPayTransactionDialog = useCallback((isOpen:boolean, transaction: Transaction) => {
  //   setActiveTransaction(transaction)
  //   setIsPayTransactionDialogOpen(isOpen)
  // }, []);

  // const closePayTransactionDialog = useCallback(() => {
  //   setActiveTransaction(null)
  //   setIsPayTransactionDialogOpen(false)
  // }, []);

  return (
    <TransactionsContext.Provider
      value={{
        selectedTransactions,
        activeTransaction,
        isSelectionMode,
        selectedTransactionsTotal,
        isPayTransactionDialogOpen,
        isEditTransactionDialogOpen,
        selectTransaction,
        setActiveTransaction,
        clearSelectedTransactions,
        togglePayTransactionDialog: setIsPayTransactionDialogOpen,
        toggleEditTransactionDialog: setIsEditTransactionDialogOpen
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
