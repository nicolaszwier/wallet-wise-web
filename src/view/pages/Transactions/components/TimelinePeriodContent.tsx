import { DateRange } from "@/app/hooks/useDateRanges"
import { usePlanning } from "@/app/hooks/usePlanning"
import { formatShortDate } from "@/app/utils/date"
import { formatCurrency } from "@/app/utils/formatCurrency"
import { Badge } from "@/view/components/ui/badge"
import { useTranslation } from "react-i18next"
import { TransactionListItem } from "./TransactionListItem"
import { Period } from "@/app/models/Period"
import { useTransactions } from "@/app/hooks/useTransactions"
import { Transaction } from "@/app/models/Transaction"
import { sumPendingTransactionsByType } from "@/app/utils/transactions"
import { TransactionType } from "@/app/models/TransactionType"
import { TransactionItemSkeleton } from "@/view/components/TransactionItemSkeleton"

interface ComponentProps {
  dateRange: DateRange,
  isLoading: boolean, 
  period: Period | undefined
  onSelectItem?: (transaction: Transaction) => void
  onPayItem?: (transaction: Transaction) => void
  onEditItem?: (transaction: Transaction) => void
  onDeleteItem?: (transaction: Transaction) => void
}

export function TimelinePeriodContent({ dateRange, isLoading, period, onSelectItem, onEditItem, onPayItem, onDeleteItem }: ComponentProps) {
  const { t, i18n } = useTranslation()
  const {selectedPlanning} = usePlanning()
  const {selectedTransactions} = useTransactions()

  return (
    <div className="min-w-[300px] w-full max-w-[1280px] m-auto mb-6">
        <div className="p-2 text-xs rounded-t-xl rounded-tr-xl min-h-[26px] font-semibold pl-2 sticky top-0 bg-background flex justify-between items-center">
          <span>{t('transactions.periodTitle', {start: formatShortDate(dateRange.start, i18n.language), end: formatShortDate(dateRange.end, i18n.language)})}</span>
          {dateRange.isCurrent && (
            <Badge variant="default" className="truncate">{t('global.currentPeriod')}</Badge>
          )}
        </div>
      <div className="flex flex-col justify-between flex-grow  bg-background-secondary rounded-xl">
        {isLoading ? 
          <div className="flex-grow">
            <TransactionItemSkeleton />
            <TransactionItemSkeleton />
            <TransactionItemSkeleton />
          </div>
          : 
          <>
            {period?.transactions.map((transaction) => (
              <TransactionListItem 
                key={transaction.id} 
                transaction={transaction} 
                currency={selectedPlanning?.currency ?? "BRL"} 
                isSelected={selectedTransactions.some((t) => t.id === transaction.id)}
                onSelect={onSelectItem}
                onEdit={onEditItem}
                onPay={onPayItem}
                onDelete={onDeleteItem}
              />
            ))}

            {period?.transactions.length === 0 || !period && (
              <div className="flex items-center justify-center h-full my-3 text-sm text-muted-foreground">
                {t('transactions.noTransactions')}  
              </div>
            )}
          </>
        }
      </div>
      {period && period?.transactions.length > 0 && (
        <div className="mt-2">
          <div className="flex justify-between p-1 pr-2 align-middle items-center">
            <div className="text-xs text-muted-foreground pl-2">
              {t('transactions.periodFooterExpensesPending')}
            </div>
            <div className="text-sm font-semibold pl-2 text-red">
              {formatCurrency(sumPendingTransactionsByType(period?.transactions ?? [], TransactionType.EXPENSE), selectedPlanning?.currency ?? 'BRL', i18n.language)}
            </div>
          </div>
          <div className="flex justify-between p-1 pr-2 align-middle items-center">
            <div className="text-xs text-muted-foreground pl-2">
              {t('transactions.periodFooterIncomePending')}
            </div>
            <div className="text-sm font-semibold pl-2 text-green">
              {formatCurrency(sumPendingTransactionsByType(period?.transactions ?? [], TransactionType.INCOME), selectedPlanning?.currency ?? 'BRL', i18n.language)}
            </div>
          </div>
          <div className="flex justify-between p-1 pr-2 align-middle items-center">
            <div className="text-xs text-muted-foreground pl-2">
              {t('transactions.periodFooter', {date: formatShortDate(dateRange.end, i18n.language)})}
            </div>
            <div className="text-sm font-semibold pl-2">
              {formatCurrency(period?.expectedAllTimeBalance ?? 0, selectedPlanning?.currency ?? 'BRL', i18n.language)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}