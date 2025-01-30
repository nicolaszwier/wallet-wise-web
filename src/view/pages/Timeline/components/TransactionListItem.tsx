import { Transaction } from "@/app/models/Transaction"
import { formatDate } from "@/app/utils/date"
import { formatCurrency } from "@/app/utils/formatCurrency"
import { CategoryIcon } from "@/view/components/CategoryIcon"
import { useTranslation } from "react-i18next"

interface ComponentProps {
  transaction: Transaction,
  currency: string
}

export function TransactionListItem({transaction, currency}: ComponentProps) {
  const { i18n } = useTranslation()

  return (
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none hover:bg-background-tertiary transition-all">  
      <CategoryIcon size={15} icon={transaction.category?.icon}/>
      <div className="grid flex-1 text-left">
        <span className="truncate text-xs font-semibold">{transaction.description}</span>
        <span className="truncate text-xs">{transaction.category?.description}</span>
      </div>
      <div className="flex justify-end flex-col items-end text-right">
        <span className="truncate text-xs">{formatDate(new Date(transaction.date), i18n.language)}</span>
        <span className="truncate text-xs font-semibold">{formatCurrency(transaction.amount, currency, i18n.language)}</span>
      </div>
    </div>
  )
}