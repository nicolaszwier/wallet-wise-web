import { formatDate, formatShortDate } from "@/app/utils/date";
import { Button } from "@/view/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResizablePeriodsView } from "./components/ResizablePeriodsView";
import { useResizableViewController } from "./useResizableViewController";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/view/components/ui/drawer";
import { usePreferredView } from "@/app/hooks/usePreferredView";
import { ViewType } from "@/app/models/ViewType";

export default function Timeline() {
  const { preferredView, changePreferredView } = usePreferredView()
  // const { t, i18n } = useTranslation()
  // const {visibleRanges, handleNextRanges, handlePreviousRanges, isLoading, loadPeriodByDate} = useTimelineController()
  
  return (
    <div className="h-full relative">
      {preferredView === ViewType.RESIZABLE && (
        <ResizablePeriodsView/>
      )}
      {preferredView === ViewType.TIMELINE && (
        <p> Timeline </p>
      )}
      {preferredView === ViewType.HORIZONTAL && (
        <p> Horizontal </p>
      )}
    </div>
  )
}