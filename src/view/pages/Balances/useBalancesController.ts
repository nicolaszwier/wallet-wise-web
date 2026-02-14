import { usePlanning } from "@/app/hooks/usePlanning";
import { formatMonthYear } from "@/app/utils/date";
import { Balance } from "@/app/models/Balance";
import { transactionsService } from "@/services/transactionsService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function useBalancesController() {
  const { selectedPlanning } = usePlanning();
  const { i18n } = useTranslation();

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cache = useRef<Map<string, Balance>>(new Map());

  const fetchBalance = useCallback(
    async (month: number, year: number) => {
      if (!selectedPlanning?.id) return;

      const key = `${year}-${month}`;
      const cached = cache.current.get(key);
      if (cached) {
        setBalance(cached);
        return;
      }

      setIsLoading(true);
      try {
        const data = await transactionsService.fetchMonthlyBalance(
          selectedPlanning.id,
          String(month),
          String(year)
        );
        cache.current.set(key, data);
        setBalance(data);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPlanning?.id]
  );

  const goToPreviousMonth = useCallback(() => {
    const newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const newYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    fetchBalance(newMonth, newYear);
  }, [currentMonth, currentYear, fetchBalance]);

  const goToNextMonth = useCallback(() => {
    const newMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const newYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    fetchBalance(newMonth, newYear);
  }, [currentMonth, currentYear, fetchBalance]);

  const formattedMonthYear = formatMonthYear(
    currentMonth,
    currentYear,
    i18n.language
  );

  useEffect(() => {
    if (!selectedPlanning?.id) return;
    fetchBalance(currentMonth, currentYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanning?.id]);

  return {
    currentMonth,
    currentYear,
    formattedMonthYear,
    balance,
    isLoading,
    goToPreviousMonth,
    goToNextMonth,
    fetchBalance,
  };
}
