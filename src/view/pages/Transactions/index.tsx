import { ResizablePeriodsView } from "./components/ResizablePeriodsView";
import { ViewType } from "@/app/models/ViewType";
import { useApp } from "@/app/hooks/useApp";
import { ColumnsPeriodsView } from "./components/ColumnsPeriodsView";

export default function Timeline() {
  const {preferredView} = useApp()
  // const { preferredView, changePreferredView } = usePreferredView()
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
      {preferredView === ViewType.COLUMNS && (
        <ColumnsPeriodsView />
      )}
    </div>
  )
}