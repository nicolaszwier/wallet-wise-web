import { DateRange, useDateRanges } from "@/app/hooks/useDateRanges";
import { usePlanning } from "@/app/hooks/usePlanning";
import { useTransactions } from "@/app/hooks/useTransactions";
import { Period } from "@/app/models/Period";
import { Transaction } from "@/app/models/Transaction";
import { PeriodRequestFilters, periodsService } from "@/services/periodsService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export function useTransactionsViewController() {
  const isDraggingRef = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [visibleRanges, setVisibleRanges] = useState<DateRange[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const {ranges, loadNextRanges, loadPreviousRanges} = useDateRanges()
  const {selectedPlanning} = usePlanning()
  const {selectTransaction} = useTransactions()
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
    console.log('transaction', transaction);
    selectTransaction(transaction);
    
  }

  // Create a simpler drag-to-scroll implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container) return
    
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

  return {
    visibleRanges,
    isLoading: isFetching,
    scrollContainerRef,
    loadPeriodByDate,
    refetchPeriods: refetch,
    handleNextRanges,
    handlePreviousRanges,
    handleSelectItem,
    handleMouseDown
  };
}
