import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/view/components/ui/resizable"
import { ResizablePeriodContent } from "./ResizablePeriodContent"
import { useResizableViewController } from "../useResizableViewController"
import { Button } from "@/view/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/view/components/ui/drawer"
import { formatDate, formatShortDate } from "@/app/utils/date"
import { useTranslation } from "react-i18next"
import { NewTransactionDrawer } from "./NewTransactionDrawer"

interface ComponentProps {
  // dateRanges: DateRange[],
  // isLoading: boolean,
  // transactionsFilterer: (start: Date, end: Date) => Period | undefined
}

export function ResizablePeriodsView({}: ComponentProps) {
  const { t, i18n } = useTranslation()
  const {visibleRanges, handleNextRanges, handlePreviousRanges, isLoading, loadPeriodByDate} = useResizableViewController()

  return (
    <div className="h-full relative">
      <div className="justify-between flex items-center">
        <div className="min-w-36"></div>
        <div className="flex justify-center items-center bg-background gap-2 sticky top-[70px]">
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
    <ResizablePanelGroup direction="vertical" className="rounded-lg border" style={{height: 'calc(100% - 32px)'}}>
      <ResizablePanel defaultSize={50} minSize={4} className="bg-background-secondary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {visibleRanges[0] && <ResizablePeriodContent dateRange={visibleRanges[0]} isLoading={isLoading} period={loadPeriodByDate(visibleRanges[0].start, visibleRanges[0].end)} /> }
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {visibleRanges[1] && <ResizablePeriodContent dateRange={visibleRanges[1]} isLoading={isLoading} period={loadPeriodByDate(visibleRanges[1].start, visibleRanges[1].end)} /> }
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} minSize={4} className="bg-background-secondary">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {visibleRanges[2] && <ResizablePeriodContent dateRange={visibleRanges[2]} isLoading={isLoading} period={loadPeriodByDate(visibleRanges[2].start, visibleRanges[2].end)}/> }
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} className="flex flex-col justify-between">
            {visibleRanges[3] && <ResizablePeriodContent dateRange={visibleRanges[3]} isLoading={isLoading} period={loadPeriodByDate(visibleRanges[3].start, visibleRanges[3].end)}/> }
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
  )
}