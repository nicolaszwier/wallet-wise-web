import { formatDate, formatShortDate } from "@/app/utils/date";
import { Button } from "@/view/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResizablePeriodsView } from "./components/ResizablePeriodsView";
import { useTimelineController } from "./useTimelineController";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/view/components/ui/drawer";

export default function Timeline() {
  const { t, i18n } = useTranslation()
  const {visibleRanges, handleNextRanges, handlePreviousRanges, isLoading, loadPeriodByDate} = useTimelineController()
  
  return (
    <div className="h-full relative">
      <div className="justify-between flex items-center">
        <div className="min-w-36"></div>
        <div className="flex justify-center items-center bg-background gap-2 sticky top-[70px]">
          <Button variant="ghost" size="icon" onClick={() => handlePreviousRanges()}>
            <ChevronLeft />
          </Button>
          <p className="font-semibold text-sm"><span>{t('timeline.periodTitle', {start: formatShortDate(visibleRanges[0]?.start, i18n.language), end: formatDate(visibleRanges[3]?.end, i18n.language)})}</span></p>
          <Button variant="ghost" size="icon" onClick={() => handleNextRanges()}>
            <ChevronRight />
          </Button>
        </div>
        <Drawer>
          <DrawerTrigger>
            <Button size="xs">
              <Plus /> {t('timeline.addTransaction')}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>


      </div>
      <ResizablePeriodsView dateRanges={visibleRanges} isLoading={isLoading} transactionsFilterer={loadPeriodByDate} />
    </div>
  )
}