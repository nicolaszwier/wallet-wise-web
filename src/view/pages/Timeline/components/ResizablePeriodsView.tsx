import { DateRange } from "@/app/hooks/useDateRanges"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/view/components/ui/resizable"
import { ResizablePeriodContent } from "./ResizablePeriodContent"
import { Period } from "@/app/models/Period"

interface ComponentProps {
  dateRanges: DateRange[],
  isLoading: boolean,
  transactionsFilterer: (start: Date, end: Date) => Period | undefined
}

export function ResizablePeriodsView({dateRanges, isLoading, transactionsFilterer}: ComponentProps) {

  return (
    <ResizablePanelGroup direction="vertical" className="rounded-lg border" style={{height: 'calc(100% - 32px)'}}>
      <ResizablePanel defaultSize={50} minSize={4} className="bg-background-secondary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {dateRanges[0] && <ResizablePeriodContent dateRange={dateRanges[0]} isLoading={isLoading} period={transactionsFilterer(dateRanges[0].start, dateRanges[0].end)} /> }
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {dateRanges[1] && <ResizablePeriodContent dateRange={dateRanges[1]} isLoading={isLoading} period={transactionsFilterer(dateRanges[1].start, dateRanges[1].end)} /> }
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} minSize={4} className="bg-background-secondary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {dateRanges[2] && <ResizablePeriodContent dateRange={dateRanges[2]} isLoading={isLoading} period={transactionsFilterer(dateRanges[2].start, dateRanges[2].end)}/> }
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {dateRanges[3] && <ResizablePeriodContent dateRange={dateRanges[3]} isLoading={isLoading} period={transactionsFilterer(dateRanges[3].start, dateRanges[3].end)}/> }
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}