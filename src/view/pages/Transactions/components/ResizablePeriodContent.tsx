import { DateRange } from "@/app/hooks/useDateRanges"
import { usePlanning } from "@/app/hooks/usePlanning"
import { formatShortDate } from "@/app/utils/date"
import { formatCurrency } from "@/app/utils/formatCurrency"
import { Badge } from "@/view/components/ui/badge"
import { useTranslation } from "react-i18next"
import { TransactionListItem } from "./TransactionListItem"
import { Period } from "@/app/models/Period"
import { TransactionItemSkeleton } from "@/view/components/TransactionItemSkeleton"

interface ComponentProps {
  dateRange: DateRange,
  isLoading: boolean, 
  period: Period | undefined
}

export function ResizablePeriodContent({ dateRange, isLoading, period }: ComponentProps) {
  const { t, i18n } = useTranslation()
  const {selectedPlanning} = usePlanning()

  return (
    <>
      <div className="p-1 text-xs rounded-tl min-h-[26px] bg-background-tertiary font-semibold pl-2 sticky top-0 flex justify-between items-center">
        <span>{t('transactions.periodTitle', {start: formatShortDate(dateRange.start, i18n.language), end: formatShortDate(dateRange.end, i18n.language)})}</span>
        {dateRange.isCurrent && (
          <Badge variant="default" className="truncate">{t('global.currentPeriod')}</Badge>
        )}
      </div>
      {isLoading ? 
        <>
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
        </>
        : 
        <div className="flex-grow p-1">
          {period?.transactions.map((transaction) => (
            <TransactionListItem key={transaction.id} transaction={transaction} currency={selectedPlanning?.currency ?? "BRL"}/>
          ))}
        </div>
      }
      <div className="flex justify-between p-1 pr-2 align-middle items-center">
        <div className="text-xs text-muted-foreground pl-2">
          {t('transactions.periodFooter', {date: formatShortDate(dateRange.end, i18n.language)})}
        </div>
        <div className="text-sm font-semibold pl-2">{formatCurrency(period?.expectedAllTimeBalance ?? 0, selectedPlanning?.currency ?? 'BRL', i18n.language)}</div>
      </div>
    </>
  )
}