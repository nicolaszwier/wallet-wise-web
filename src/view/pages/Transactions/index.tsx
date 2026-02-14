import { ResizablePeriodsView } from "./components/ResizablePeriodsView";
import { ViewType } from "@/app/models/ViewType";
import { useApp } from "@/app/hooks/useApp";
import { ColumnsPeriodsView } from "./components/ColumnsPeriodsView";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useCurrentPeriodInView } from "@/app/hooks/useCurrentPeriodInView";
import SelectionModePopover from "./components/SelectionModePopover";
import { TimelinePeriodsView } from "./components/TimelinePeriodsView";
import { NewTransactionDialog } from "./components/NewTransactionDialog";
import { TransactionsFiltersDialog } from "./components/TransactionsFiltersDialog";
import { Button } from "@/view/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/app/utils/cn";

export default function Timeline() {
  const { preferredView } = useApp();
  const { isSelectionMode } = useTransactions();
  const { t } = useTranslation();
  const { isCurrentPeriodVisible, scrollDirection, scrollToCurrentPeriod } = useCurrentPeriodInView(preferredView);

  const showScrollToCurrentButton =
    (preferredView === ViewType.TIMELINE || preferredView === ViewType.COLUMNS) &&
    !isCurrentPeriodVisible;

  const canShowScrollButton =
    preferredView === ViewType.TIMELINE || preferredView === ViewType.COLUMNS;

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
        <div className="fixed inset-x-0 bottom-5 flex justify-center p-3 z-40">
          <SelectionModePopover />
        </div>
      )}
      <div className="fixed bottom-5 right-5 sm:bottom-9 sm:right-11 z-30 flex items-center gap-2">
        {canShowScrollButton && (
          <div
            className={cn(
              "grid overflow-hidden transition-all duration-200 ease-out shadow-md rounded-md",
              showScrollToCurrentButton
                ? "max-w-[3.5rem] opacity-100"
                : "max-w-0 opacity-0 pointer-events-none"
            )}
          >
            <Button
              size="icon-lg"
              variant="default"
              className="border border-border-light shrink-0 bg-background"
              onClick={scrollToCurrentPeriod}
              aria-label={t("transactions.scrollToCurrentPeriod")}
              title={t("transactions.scrollToCurrentPeriod")}
              aria-hidden={!showScrollToCurrentButton}
            >
              {scrollDirection === "up" ? (
                <ChevronUp size={30} strokeWidth={3} />
              ) : (
                <ChevronDown size={30} strokeWidth={3} />
              )}
            </Button>
          </div>
        )}
        <NewTransactionDialog />
      </div>
      <TransactionsFiltersDialog />
    </div>
  )
}