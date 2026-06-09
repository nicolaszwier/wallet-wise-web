import { useApp } from "@/app/hooks/useApp";
import { DateRange, useDateRanges } from "@/app/hooks/useDateRanges";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import { usePlanning } from "@/app/hooks/usePlanning";
import { useTransactions } from "@/app/hooks/useTransactions";
import { Period } from "@/app/models/Period";
import { Transaction } from "@/app/models/Transaction";
import { ViewType } from "@/app/models/ViewType";
import { periodsService } from "@/services/periodsService";
import { recurringConfigsService } from "@/services/recurringConfigsService";
import { transactionsService } from "@/services/transactionsService";
import { useTimelineScrollPersistence } from "@/app/hooks/useTimelineScrollPersistence";
import {
  getPeriodsQueryKey,
  invalidatePeriodsQueries,
} from "@/app/utils/timelinePersistence";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

export type DeleteScope = 'occurrence' | 'series';
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useTransactionsViewController() {
  const isMobile = useIsMobile()
  const isDraggingRef = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation() 
  const [visibleRanges, ] = useState<DateRange[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const {ranges, loadNextRanges, loadPreviousRanges} = useDateRanges()
  const {selectedPlanning} = usePlanning()
  const {preferredView} = useApp()
  const { 
    filters,
    filtersHydrated,
    activeTransaction,
    isPayTransactionDialogOpen,
    isDeleteTransactionDialogOpen,
    showEmptyPeriods,
    setFilters,
    selectTransaction,
    toggleEditTransactionDialog,
    togglePayTransactionDialog,
    toggleDeleteTransactionDialog,
    setActiveTransaction, 
  } = useTransactions()
  const queryClient = useQueryClient();
  const rangeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [deleteScope, setDeleteScope] = useState<DeleteScope>('occurrence');
  const isRecurringDelete = !!activeTransaction?.recurringConfigId;
  
  const { data, isFetching, isPending, refetch } = useQuery({
    queryKey: getPeriodsQueryKey(selectedPlanning?.id || '', filters),
    queryFn: () => periodsService.fetch(selectedPlanning?.id || "", filters),
    enabled: !!selectedPlanning?.id && !!ranges && filtersHydrated,
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });

  const isInitialLoading = isPending && !data;

  // useEffect(() => {
  //   console.log('[useEffect] ranges', ranges);
  //   console.log('[useEffect] currentPageIndex', currentPageIndex);
    
  //   setFilters(prev => ({
  //     ...prev,
  //     startDate: ranges[currentPageIndex]?.start.toISOString(),
  //     endDate: ranges[currentPageIndex + 3]?.end.toISOString() ?? new Date()
  //   }));
    
  //   setVisibleRanges(ranges.slice(currentPageIndex, currentPageIndex + 4));
  // }, [ranges, currentPageIndex]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      sortOrder: preferredView === ViewType.COLUMNS ? 'asc' : 'desc',
    }))
  }, [preferredView, setFilters])

  const handleNextRanges = () => {
    if (currentPageIndex + 4 >= ranges.length - 4) {
      loadNextRanges()
    }
    setCurrentPageIndex(prev => prev + 4)
  }

  const handlePreviousRanges = () => {
    if (currentPageIndex === 0) {
      loadPreviousRanges()
    } else {
      setCurrentPageIndex(prev => Math.max(0, prev - 4))
    }
  }

  const loadPeriodByDate = (start: Date, end: Date): Period | undefined => {
    if (!start || !end || !data) {
      return
    }
    return data?.find(period => {
      const periodStart = new Date(period.periodStart?.split('Z')[0])
      const periodEnd = new Date(period.periodEnd?.split('Z')[0])
      return (start.getDate() == periodStart.getDate() && 
        end.getDate() == periodEnd.getDate() && 
        start.getMonth() == periodStart.getMonth() && 
        end.getMonth() == periodEnd.getMonth() && 
        start.getFullYear() == periodStart.getFullYear() && 
        end.getFullYear() == periodEnd.getFullYear() 
      )
    })
  }

  const handleSelectItem = (transaction: Transaction) => {
    selectTransaction(transaction);
  }

  const openPayTransactionDialog = (transaction: Transaction) => {
    togglePayTransactionDialog(true)
    setActiveTransaction(transaction);
  }

  const openEditTransactionDialog = (transaction: Transaction) => {
    toggleEditTransactionDialog(true)
    setActiveTransaction(transaction);
  }

  const openDeleteTransactionDialog = (transaction: Transaction) => {
    setDeleteScope('occurrence');
    toggleDeleteTransactionDialog(true);
    setActiveTransaction(transaction);
  };

  const handleDeleteDialogOpenChange = (open: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof open === 'function' ? open(isDeleteTransactionDialogOpen) : open;
    if (!next) {
      setDeleteScope('occurrence');
    }
    toggleDeleteTransactionDialog(next);
  };

  const { mutateAsync: payTransaction, isPending: isPendingPayTransaction, error } = useMutation({
    mutationFn: async (data: Transaction | null) => {
      return transactionsService.pay(data?.periodId ?? "", data?.id ?? "")
    }
  })

  const handlePayTransaction = async () => {
    try {
      await payTransaction(activeTransaction);
      queryClient.invalidateQueries({queryKey: ['planning']});
      invalidatePeriodsQueries(queryClient, selectedPlanning?.id || '', filters);
      toast.success(t('transactions.actionsMessages.paySuccess'), {position: "bottom-center", duration: 6000,})
      togglePayTransactionDialog(false);
    } catch (err) {      
      console.error('Transaction payment error:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || t('transactions.actionsMessages.payError'), {position: "bottom-center", duration: 6000})
    }
  }

  const { mutateAsync: deleteTransaction, isPending: isPendingDeleteOccurrence, error: errorDeleteOccurrence } = useMutation({
    mutationFn: async (data: Transaction | null) => {
      return transactionsService.remove(data?.periodId ?? "", data?.id ?? "");
    },
  });

  const { mutateAsync: deleteRecurringConfig, isPending: isPendingDeleteSeries, error: errorDeleteSeries } = useMutation({
    mutationFn: async (configId: string) => {
      return recurringConfigsService.remove(configId);
    },
  });

  const isPendingDeleteTransaction = isPendingDeleteOccurrence || isPendingDeleteSeries;

  const handleDeleteTransaction = async () => {
    try {
      if (deleteScope === 'series' && activeTransaction?.recurringConfigId) {
        await deleteRecurringConfig(activeTransaction.recurringConfigId);
        queryClient.invalidateQueries({ queryKey: ['planning'] });
        invalidatePeriodsQueries(queryClient, selectedPlanning?.id || '', filters);
        queryClient.invalidateQueries({ queryKey: ['recurring-configs', selectedPlanning?.id] });
        toast.success(t('recurringTransactions.actionsMessages.deleteSuccess'), { position: "bottom-center", duration: 6000 });
      } else {
        await deleteTransaction(activeTransaction);
        queryClient.invalidateQueries({ queryKey: ['planning'] });
        invalidatePeriodsQueries(queryClient, selectedPlanning?.id || '', filters);
        toast.success(t('transactions.actionsMessages.deleteSuccess'), { position: "bottom-center", duration: 6000 });
      }
      handleDeleteDialogOpenChange(false);
    } catch (err) {
      console.error('Transaction delete error:', err);
      const deleteError = deleteScope === 'series' ? errorDeleteSeries : errorDeleteOccurrence;
      const fallbackMessage = deleteScope === 'series'
        ? t('recurringTransactions.actionsMessages.deleteError')
        : t('transactions.actionsMessages.deleteError');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((deleteError as any)?.response?.data?.message || (err as any)?.response?.data?.message || fallbackMessage, { position: "bottom-center", duration: 6000 });
    }
  };

  // Create a simpler drag-to-scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container || isMobile) return
    
    // Prevent text selection
    e.preventDefault()
    
    // Record initial position
    isDraggingRef.current = true
    const startX = e.pageX
    const scrollLeft = container.scrollLeft
    
    // Add temporary user-select: none to body
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    container.style.cursor = 'grabbing'
    
    // Handlers for mousemove and mouseup
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      
      // Calculate distance and scroll
      const x = e.pageX
      const walk = (x - startX) * 1.5 // Increase for faster scrolling
      container.scrollLeft = scrollLeft - walk
      
      // Important: prevent default to avoid text selection
      e.preventDefault()
    }
    
    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      container.style.cursor = 'grab'
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    // Add event listeners to document
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Reset selection state on component unmount
  useEffect(() => {
    return () => {
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  }, [])
  
   // Initialize refs array with the correct length
   useEffect(() => {
     rangeRefs.current = rangeRefs.current.slice(0, ranges.length);
   }, [ranges.length]);
   
  const currentRangeIndex = useMemo(
    () => ranges.findIndex((range) => range.isCurrent),
    [ranges],
  );

  useTimelineScrollPersistence({
    columnsScrollRef: scrollContainerRef,
    isReady: !!selectedPlanning?.id && ranges.length > 0,
    isFetching,
    currentRangeIndex,
  });


  return {
    selectedPlanning,
    ranges,
    rangeRefs,
    visibleRanges,
    isLoading: isInitialLoading,
    scrollContainerRef,
    isPayTransactionDialogOpen,
    isDeleteTransactionDialogOpen,
    activeTransaction,
    isPendingPayTransaction,
    isPendingDeleteTransaction,
    showEmptyPeriods,
    deleteScope,
    setDeleteScope,
    isRecurringDelete,
    handleDeleteTransaction,
    handlePayTransaction,
    togglePayTransactionDialog,
    toggleDeleteTransactionDialog: handleDeleteDialogOpenChange,
    openDeleteTransactionDialog,
    openPayTransactionDialog,
    openEditTransactionDialog,
    loadPeriodByDate,
    refetchPeriods: refetch,
    handleNextRanges,
    handlePreviousRanges,
    handleSelectItem,
    handleMouseDown,
  };
}
