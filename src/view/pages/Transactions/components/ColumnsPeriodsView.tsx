import { Button } from "@/view/components/ui/button"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { formatDate, formatShortDate } from "@/app/utils/date"
import { useTranslation } from "react-i18next"
import { ColumnsPeriodContent } from "./ColumnsPeriodContent"
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
    ranges,
    rangeRefs,
    isLoading, 
    scrollContainerRef,
    isPayTransactionDialogOpen,
    isDeleteTransactionDialogOpen,
    activeTransaction,
    isPendingPayTransaction,
    isPendingDeleteTransaction,
    showEmptyPeriods,
    handlePayTransaction,
    // handleNextRanges,
    handleDeleteTransaction,
    // handlePreviousRanges, 
    loadPeriodByDate,
    handleSelectItem,
    handleMouseDown,
    togglePayTransactionDialog,
    toggleDeleteTransactionDialog,
    openPayTransactionDialog,
    openDeleteTransactionDialog,
    openEditTransactionDialog
  } = useTransactionsViewController()

  return (
    <div className="flex flex-col h-full w-full">
      {/* <div className="flex justify-center items-center flex-shrink-0 pl-2 pr-2">
        <div className="flex justify-center items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handlePreviousRanges()}>
            <ChevronLeft />
          </Button>
          <p className="font-semibold text-sm"><span>{t('transactions.periodTitle', {start: formatShortDate(visibleRanges[0]?.start, i18n.language), end: formatDate(visibleRanges[3]?.end, i18n.language)})}</span></p>
          <Button variant="ghost" size="icon" onClick={() => handleNextRanges()}>
            <ChevronRight />
          </Button>
        </div>
      </div> */}
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
          <ResponsiveDialogFooter className="flex flex-col-reverse">
            <DialogClose asChild>
              <Button variant="ghost">{t('global.cta.cancel')}</Button>
            </DialogClose>
            <Button disabled={isPendingPayTransaction} onClick={handlePayTransaction}>
              {isPendingPayTransaction && <Spinner />}  
              {t('global.cta.pay')}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      <ResponsiveDialog open={isDeleteTransactionDialogOpen} onOpenChange={toggleDeleteTransactionDialog}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <DialogTitle>
              {t('transactions.deleteTransactionDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('transactions.deleteTransactionDialog.description', {description: activeTransaction?.description, amount: formatCurrency(Math.abs(activeTransaction?.amount ?? 0), selectedPlanning?.currency ?? 'BRL', i18n.language)})}
            </DialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter className="flex flex-col-reverse">
            <DialogClose asChild>
              <Button variant="ghost">{t('global.cta.cancel')}</Button>
            </DialogClose>
            <Button disabled={isPendingDeleteTransaction} onClick={handleDeleteTransaction}>
              {isPendingDeleteTransaction && <Spinner />}  
              {t('global.cta.delete')}
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
            {ranges.map((range, index) => {
              const period = loadPeriodByDate(range.start, range.end)
              const isVisible = showEmptyPeriods || (period?.transactions ?? []).length > 0 || isLoading
              if (!isVisible) return null

              return (
                <div 
                  key={index} 
                  className="flex flex-col flex-grow min-w-80 sm:min-w-96 max-w-96 bg-background-secondary rounded-xl"
                  ref={el => { rangeRefs.current[index] = el; }}
                  id={range.isCurrent ? "current-period" : `period-${index}`}
                  >
                  {range && 
                    <ColumnsPeriodContent 
                      dateRange={range} 
                      isLoading={isLoading} 
                      period={loadPeriodByDate(range.start, range.end)} 
                      onSelectItem={handleSelectItem}
                      onPayItem={openPayTransactionDialog}
                      onEditItem={openEditTransactionDialog}
                      onDeleteItem={openDeleteTransactionDialog}
                    />
                  }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}