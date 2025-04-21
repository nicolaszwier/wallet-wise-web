import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTransactions } from './useTransactions';

export interface DateRange {
  start: Date;
  end: Date;
  isCurrent: boolean;
}

interface UseDateRangesReturn {
  ranges: DateRange[];
  loadNextRanges: (count?: number) => void;
  loadPreviousRanges: (count?: number) => void;
}

export function useDateRanges (initialCount: number = 4): UseDateRangesReturn {
  const { filters } = useTransactions();
  
  // Helper function to generate a week range
  const getWeekRange = (startDate: Date): DateRange => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    start.setHours(0, 0, 0)
    end.setHours(23, 59, 59)
    return { start, end, isCurrent: false };
  };

  // Generate ranges function based on start and end dates
  const generateRangesBetweenDates = useCallback((startDate: Date, endDate: Date, sortOrder: 'asc' | 'desc' = 'asc'): DateRange[] => {
    const newRanges: DateRange[] = [];
    const currentDate = new Date(startDate);
    
    // Ensure we don't go beyond the end date
    while (currentDate <= endDate) {
      newRanges.push(getWeekRange(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    // Sort ranges according to sortOrder
    return sortOrder === 'asc' ? newRanges : [...newRanges].reverse();
  }, []);

  // State to store all the date ranges
  const [ranges, setRanges] = useState<DateRange[]>(() => {
    // Default initial ranges if no filters are set
    const today = new Date();
    const currentDay = today.getDay();
    const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
    
    // Start from 1 weeks before the current week
    const firstDate = new Date(today);
    firstDate.setDate(today.getDate() - daysToSubtract - 7);
    
    const defaultRanges: DateRange[] = [];
    const currentDate = new Date(firstDate);
    
    for (let i = 0; i < initialCount; i++) {
      defaultRanges.push(getWeekRange(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return defaultRanges;
  });
  
  // Update ranges when filters change
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      // Adjust startDate to beginning of week (Monday)
      const startDay = startDate.getDay();
      const daysToAdjust = startDay === 0 ? 1 : (startDay === 1 ? 0 : -(startDay - 1));
      startDate.setDate(startDate.getDate() + daysToAdjust);
      
      setRanges(generateRangesBetweenDates(startDate, endDate, filters.sortOrder));
    }
  }, [filters.startDate, filters.endDate, filters.sortOrder, generateRangesBetweenDates]);

  // Function to load next set of ranges
  const loadNextRanges = useCallback((count: number = 4): void => {
    setRanges(currentRanges => {
      if (currentRanges.length === 0) return currentRanges;
      
      if (filters.sortOrder === 'desc') {
        // When sorted in descending order, "next" means older (previous) dates
        const firstRange = currentRanges[0];
        const previousEndDate = new Date(firstRange.start);
        previousEndDate.setDate(previousEndDate.getDate() - 1);
        
        const newRanges: DateRange[] = [];
        const endDate = new Date(previousEndDate);
        
        for (let i = count - 1; i >= 0; i--) {
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          newRanges.unshift(getWeekRange(startDate));
          endDate.setDate(startDate.getDate() - 1);
        }
        
        return [...newRanges.reverse(), ...currentRanges];
      } else {
        // When sorted in ascending order, "next" means newer (future) dates
        const lastRange = currentRanges[currentRanges.length - 1];
        const nextStartDate = new Date(lastRange.end);
        nextStartDate.setDate(nextStartDate.getDate() + 1);
        
        const newRanges: DateRange[] = [];
        const currentDate = new Date(nextStartDate);
        
        for (let i = 0; i < count; i++) {
          newRanges.push(getWeekRange(currentDate));
          currentDate.setDate(currentDate.getDate() + 7);
        }
        
        return [...currentRanges, ...newRanges];
      }
    });
  }, [filters.sortOrder]);

  // Function to load previous set of ranges
  const loadPreviousRanges = useCallback((count: number = 4): void => {
    setRanges(currentRanges => {
      if (currentRanges.length === 0) return currentRanges;
      
      if (filters.sortOrder === 'desc') {
        // When sorted in descending order, "previous" means newer (future) dates
        const lastRange = currentRanges[currentRanges.length - 1];
        const nextStartDate = new Date(lastRange.end);
        nextStartDate.setDate(nextStartDate.getDate() + 1);
        
        const newRanges: DateRange[] = [];
        const currentDate = new Date(nextStartDate);
        
        for (let i = 0; i < count; i++) {
          newRanges.push(getWeekRange(currentDate));
          currentDate.setDate(currentDate.getDate() + 7);
        }
        
        return [...currentRanges, ...newRanges.reverse()];
      } else {
        // When sorted in ascending order, "previous" means older (past) dates
        const firstRange = currentRanges[0];
        const previousEndDate = new Date(firstRange.start);
        previousEndDate.setDate(previousEndDate.getDate() - 1);
        
        const newRanges: DateRange[] = [];
        const endDate = new Date(previousEndDate);
        
        for (let i = count - 1; i >= 0; i--) {
          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          
          newRanges.unshift(getWeekRange(startDate));
          endDate.setDate(startDate.getDate() - 1);
        }
        
        return [...newRanges, ...currentRanges];
      }
    });
  }, [filters.sortOrder]);

  // Calculate if the current date is within each range
  const rangesWithCurrent = useMemo((): DateRange[] => {
    const today = new Date();
    return ranges.map(range => ({
      ...range,
      isCurrent: today >= range.start && today <= range.end
    }));
  }, [ranges]);

  return {
    ranges: rangesWithCurrent,
    loadNextRanges,
    loadPreviousRanges
  };
};
