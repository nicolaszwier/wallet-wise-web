import { usePlanning } from "@/app/hooks/usePlanning";
import { transactionsService } from "@/services/transactionsService";
import { useQuery } from "@tanstack/react-query";

export function useDashboardController() {
    const {selectedPlanning} = usePlanning()
    const { data, isFetching, isInitialLoading, refetch } = useQuery({
      queryKey: ['transactions-due-this-week'],
      queryFn: () => transactionsService.fetchDueThisWeek(selectedPlanning?.id || ""),
      enabled: !!selectedPlanning?.id,
    });
    
    const { data:balanceData, isFetching: isFetchingBalance, refetch: refetchBalance } = useQuery({
      queryKey: ['monthly-balance'],
      queryFn: () => transactionsService.fetchMonthlyBalance(selectedPlanning?.id || ""),
      enabled: !!selectedPlanning?.id,
    });

    return {
      transactions: data ?? [],
      balance: balanceData,
      isLoading: isFetching,
      isLoadingBalance: isFetchingBalance,
      isInitialLoading,
      refetchTransactions: refetch,
      refetchBalance: refetchBalance,
    };
}
