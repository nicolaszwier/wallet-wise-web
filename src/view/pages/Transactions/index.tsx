import { ResizablePeriodsView } from "./components/ResizablePeriodsView";
import { ViewType } from "@/app/models/ViewType";
import { useApp } from "@/app/hooks/useApp";
import { ColumnsPeriodsView } from "./components/ColumnsPeriodsView";
import { useTransactions } from "@/app/hooks/useTransactions";
import SelectionModePopover from "./components/SelectionModePopover";
import { TimelinePeriodsView } from "./components/TimelinePeriodsView";
import { NewTransactionDialog } from "./components/NewTransactionDialog";

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
        <div className="fixed w-full flex justify-center bottom-5 p-3 z-40">
          <SelectionModePopover />
        </div>
      )}
      <div className="fixed bottom-5 right-5 sm:bottom-9 sm:right-11 z-30">
        <NewTransactionDialog />
      </div>
    </div>
  )
}