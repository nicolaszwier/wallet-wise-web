import { ResizablePeriodsView } from "./components/ResizablePeriodsView";
import { ViewType } from "@/app/models/ViewType";
import { useApp } from "@/app/hooks/useApp";
import { ColumnsPeriodsView } from "./components/ColumnsPeriodsView";
import { useTransactions } from "@/app/hooks/useTransactions";
import SelectionModePopover from "./components/SelectionModePopover";
import { TimelinePeriodsView } from "./components/TimelinePeriodsView";

export default function Timeline() {
  const {preferredView} = useApp()
  const {isSelectionMode} = useTransactions()
  
  return (
    <div className="h-full">
      {preferredView === ViewType.RESIZABLE && (
        <ResizablePeriodsView/>
      )}
      {preferredView === ViewType.TIMELINE && (
        <TimelinePeriodsView />
      )}
      {preferredView === ViewType.COLUMNS && (
        <ColumnsPeriodsView />
      )}
      {isSelectionMode && (
        <div className="w-full flex justify-center absolute bottom-5 p-3">
          <SelectionModePopover />
        </div>
      )}
    </div>
  )
}