import { DateRange, useDateRanges } from "@/app/hooks/useDateRanges";
import { usePlanning } from "@/app/hooks/usePlanning";
import { Period } from "@/app/models/Period";
import { PeriodRequestFilters, periodsService } from "@/services/periodsService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useResizableViewController() {
  const [visibleRanges, setVisibleRanges] = useState<DateRange[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const {ranges, loadNextRanges, loadPreviousRanges} = useDateRanges()
  const {selectedPlanning} = usePlanning()
  // const [periods, setPeriods] = useState<Period[][]>([])
  const [filters, setFilters] = useState<PeriodRequestFilters>({
    sortOrder: 'desc',
    startDate: ranges[0]?.start.toISOString(),
    endDate: ranges[ranges.length - 1]?.end.toISOString()
  });
  
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['periods', selectedPlanning?.id, filters.startDate, filters.endDate],
    queryFn: () => periodsService.fetch(selectedPlanning?.id || "", filters),
    enabled: !!selectedPlanning?.id && !!ranges,
    staleTime: 1000 * 60
  });

  useEffect(() => {
    console.log('[useEffect] ranges', ranges);
    console.log('[useEffect] currentPageIndex', currentPageIndex);
    
    setFilters(prev => ({
      ...prev,
      startDate: ranges[currentPageIndex]?.start.toISOString(),
      endDate: ranges[currentPageIndex + 3]?.end.toISOString() ?? new Date()
    }));
    
    setVisibleRanges(ranges.slice(currentPageIndex, currentPageIndex + 4));
  }, [ranges, currentPageIndex]);

  const handleNextRanges = () => {
    if (currentPageIndex + 4 >= ranges.length - 4) {
      loadNextRanges()
    }
    setCurrentPageIndex(prev => prev + 4)

    console.log("ranges", ranges);
    
  }

  const handlePreviousRanges = () => {
    if (currentPageIndex === 0) {
      loadPreviousRanges()
    } else {
      setCurrentPageIndex(prev => Math.max(0, prev - 4))
    }
  }

  const loadPeriodByDate = (start: Date, end: Date): Period | undefined => {
    if (!start || !end) {
      return
    }
    // console.log("dataa,", start, end, data);
    
    return data?.find(period => {
      const periodStart = new Date(period.periodStart?.split('Z')[0])
      const periodEnd = new Date(period.periodEnd?.split('Z')[0])
      return (start.getDate() == periodStart.getDate() && 
        end.getDate() == periodEnd.getDate() && 
        start.getMonth() == periodEnd.getMonth() && 
        end.getMonth() == periodEnd.getMonth() && 
        start.getFullYear() == periodEnd.getFullYear() && 
        end.getFullYear() == periodEnd.getFullYear() 
      )
    })
  }

  return {
    visibleRanges,
    isLoading: isFetching,
    loadPeriodByDate,
    refetchPeriods: refetch,
    handleNextRanges,
    handlePreviousRanges
  };
}
