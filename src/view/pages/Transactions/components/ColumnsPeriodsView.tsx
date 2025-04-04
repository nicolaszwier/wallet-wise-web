import { Button } from "@/view/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate, formatShortDate } from "@/app/utils/date"
import { useTranslation } from "react-i18next"
import { ColumnsPeriodContent } from "./ColumnsPeriodContent"
import { NewTransactionDialog } from "./NewTransactionDialog"
import { useTransactionsViewController } from "../useTransactionsViewController"
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from "@/view/components/ResponsiveDialog"
import { DialogClose, DialogDescription, DialogTitle } from "@/view/components/ui/dialog"
import { formatCurrency } from "@/app/utils/formatCurrency"
import { Spinner } from "@/view/components/ui/spinner"
import { EditTransactionDialog } from "./EditTransactionDialog"

export function ColumnsPeriodsView() {
  const { t, i18n } = useTranslation() 
  const { 
    selectedPlanning,
    visibleRanges, 
    isLoading, 
    scrollContainerRef,
    isPayTransactionDialogOpen,
    activeTransaction,
    isPendingPayTransaction,
    handlePayTransaction,
    handleNextRanges, 
    handlePreviousRanges, 
    loadPeriodByDate,
    handleSelectItem,
    handleMouseDown,
    togglePayTransactionDialog,
    openPayTransactionDialog,
    openEditTransactionDialog
  } = useTransactionsViewController()

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center flex-shrink-0 pl-2 pr-2">
        <div className="md:min-w-36"></div>
        <div className="flex justify-center items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handlePreviousRanges()}>
            <ChevronLeft />
          </Button>
          <p className="font-semibold text-sm"><span>{t('transactions.periodTitle', {start: formatShortDate(visibleRanges[0]?.start, i18n.language), end: formatDate(visibleRanges[3]?.end, i18n.language)})}</span></p>
          <Button variant="ghost" size="icon" onClick={() => handleNextRanges()}>
            <ChevronRight />
          </Button>
        </div>
        <NewTransactionDialog />
      </div>
      <ResponsiveDialog open={isPayTransactionDialogOpen} onOpenChange={togglePayTransactionDialog}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <DialogTitle>
              {t('transactions.payTransactionDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('transactions.payTransactionDialog.description', {description: activeTransaction?.description, amount: formatCurrency(Math.abs(activeTransaction?.amount ?? 0), selectedPlanning?.currency ?? 'BRL', i18n.language)})}
            </DialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{t('global.cta.cancel')}</Button>
            </DialogClose>
            <Button variant="secondary" disabled={isPendingPayTransaction} onClick={handlePayTransaction}>
              {isPendingPayTransaction && <Spinner />}  
              {t('global.cta.pay')}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      <EditTransactionDialog />
      
      <div className="flex-1 min-h-0 w-full relative p-2 pr-8">
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto overflow-y-hidden cursor-grab"
          onMouseDown={handleMouseDown}
        >
          <div className="flex gap-2 h-full min-w-max p-4">
            {visibleRanges.map((range, index) => (
              <div key={index} className="flex flex-col justify-between flex-grow min-w-80 max-w-96 bg-background-secondary rounded-xl">
                {range && 
                  <ColumnsPeriodContent 
                    dateRange={range} 
                    isLoading={isLoading} 
                    period={loadPeriodByDate(range.start, range.end)} 
                    onSelectItem={handleSelectItem}
                    onPayItem={openPayTransactionDialog}
                    onEditItem={openEditTransactionDialog}
                  />
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}