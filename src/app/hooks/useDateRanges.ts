import { useState, useCallback, useMemo } from 'react';

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
  // Helper function to generate a week range
  const getWeekRange = (startDate: Date): DateRange => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    start.setHours(0, 0, 0)
    end.setHours(23, 59, 59)
    return { start, end, isCurrent: false };
  };

  // Generate ranges function
  const generateRanges = useCallback((startDate: Date, count: number): DateRange[] => {
    const newRanges: DateRange[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < count; i++) {
      newRanges.push(getWeekRange(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return newRanges;
  }, []);

  // State to store all the date ranges
  const [ranges, setRanges] = useState<DateRange[]>(() => {
    // Initialize ranges with the current week in second position
    const today = new Date();
    const currentDay = today.getDay();
    const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
    
    // Start from 1 weeks before the current week
    const firstDate = new Date(today);
    firstDate.setDate(today.getDate() - daysToSubtract - 7);

    return generateRanges(firstDate, initialCount);
  });

  // Function to load next set of ranges
  const loadNextRanges = useCallback((count: number = 4): void => {
    setRanges(currentRanges => {
      const lastRange = currentRanges[currentRanges.length - 1];
      const nextStartDate = new Date(lastRange.end);
      nextStartDate.setDate(nextStartDate.getDate() + 1);
      
      const newRanges = generateRanges(nextStartDate, count);
      return [...currentRanges, ...newRanges];
    });
  }, [generateRanges]);

  // Function to load previous set of ranges
  const loadPreviousRanges = useCallback((count: number = 4): void => {
    setRanges(currentRanges => {
      const firstRange = currentRanges[0];
      const previousEndDate = new Date(firstRange.start);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      
      // Go back by (count - 1) weeks to get the start date
      const startDate = new Date(previousEndDate);
      startDate.setDate(startDate.getDate() - (7 * (count - 1)));
      
      const newRanges = generateRanges(startDate, count);
      return [...newRanges, ...currentRanges];
    });
  }, [generateRanges]);

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
