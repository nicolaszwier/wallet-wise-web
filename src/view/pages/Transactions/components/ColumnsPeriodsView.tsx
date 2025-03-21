import { useResizableViewController } from "../useResizableViewController"
import { Button } from "@/view/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { formatDate, formatShortDate } from "@/app/utils/date"
import { useTranslation } from "react-i18next"
import { useRef, useEffect } from "react"
import { ColumnsPeriodContent } from "./ColumnsPeriodContent"
import { NewTransactionDrawer } from "./NewTransactionDrawer"

interface ComponentProps {
  // dateRanges: DateRange[],
  // isLoading: boolean,
  // transactionsFilterer: (start: Date, end: Date) => Period | undefined
}

export function ColumnsPeriodsView({}: ComponentProps) {
  const { t, i18n } = useTranslation()
  const {visibleRanges, handleNextRanges, handlePreviousRanges, isLoading, loadPeriodByDate} = useResizableViewController()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

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
      const walk = (x - startX) * 2 // Increase for faster scrolling
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

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center flex-shrink-0 pl-2 pr-2">
        <div className="min-w-36"></div>
        <div className="flex justify-center items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handlePreviousRanges()}>
            <ChevronLeft />
          </Button>
          <p className="font-semibold text-sm"><span>{t('transactions.periodTitle', {start: formatShortDate(visibleRanges[0]?.start, i18n.language), end: formatDate(visibleRanges[3]?.end, i18n.language)})}</span></p>
          <Button variant="ghost" size="icon" onClick={() => handleNextRanges()}>
            <ChevronRight />
          </Button>
        </div>
        <NewTransactionDrawer />
      </div>
      
      {/* Scrollable content container - this will take all remaining height */}
      <div className="flex-1 min-h-0 w-full relative p-2">
        {/* Horizontal scrolling container */}
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto overflow-y-hidden cursor-grab"
          onMouseDown={handleMouseDown}
        >
          {/* Content row that can expand horizontally */}
          <div className="flex gap-2 h-full min-w-max p-4 pb-4">
            {visibleRanges.map((range, index) => (
              <div key={index} className="flex flex-col justify-between flex-grow min-w-80 max-w-96 bg-background-secondary rounded-xl">
                {range && <ColumnsPeriodContent dateRange={range} isLoading={isLoading} period={loadPeriodByDate(range.start, range.end)} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}