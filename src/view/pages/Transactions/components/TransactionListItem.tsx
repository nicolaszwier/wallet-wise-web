import { Transaction } from "@/app/models/Transaction"
import { cn } from "@/app/utils/cn"
import { formatDate, isAfterCurrentDate } from "@/app/utils/date"
import { formatCurrency } from "@/app/utils/formatCurrency"
import { CategoryIcon } from "@/view/components/CategoryIcon"
import { Button } from "@/view/components/ui/button"
import { Checkbox } from "@/view/components/ui/checkbox"
import { CalendarClock, CircleAlert, CircleCheck, CircleCheckBig, PencilIcon, Trash } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface ComponentProps {
  transaction: Transaction,
  currency: string,
  isSelected?: boolean,
  onSelect?: (transaction: Transaction) => void
  onPay?: (transaction: Transaction) => void
  onEdit?: (transaction: Transaction) => void
}

export function TransactionListItem({transaction, currency, isSelected, onSelect, onEdit, onPay }: ComponentProps) {
  const { t, i18n } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  const handleCheckedChange = () => {
    onSelect?.(transaction)
  }

  return (
    <div className={cn(
      "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 my-1 cursor-default text-left outline-none hover:bg-background-tertiary transition-all",
      isSelected ? "bg-background hover:bg-background" : "bg-background-secondary " 
    )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
    {!isHovered && !isSelected ? (
      <CategoryIcon 
        size={16} 
        icon={transaction.category?.icon ?? ''}
        onClick={handleCheckedChange}
      />
    ) : (
      <div className="w-[28px] flex justify-center">
        <Checkbox className="w-6 h-6" checked={isSelected} onCheckedChange={handleCheckedChange}/>
      </div>
    )}
      <div className="grid flex-1 text-left">
        <span className="truncate text-xs font-semibold">{transaction.description}</span>
        <div className="flex gap-1 align-baseline">
          <span className="truncate text-xs">{transaction.category?.description}</span>
          {transaction.isPaid && (
            <span title={t('a11y.paidTransaction')}>
              <CircleCheck xlinkTitle="" className="text-green" size={15} />
            </span>
          )}
          {!transaction.isPaid && isAfterCurrentDate(new Date(transaction.date)) && (
            <span title={t('a11y.pendingTransaction')}>
              <CircleAlert className="text-gradient" size={15} />
            </span>
          )}
          {!transaction.isPaid && !isAfterCurrentDate(new Date(transaction.date)) && (
            <span title={t('a11y.dueTransaction')}>
              <CalendarClock className="text-red font-semibold" size={15} />
            </span>
          )}

        </div>
      </div>
      {(!isHovered || isSelected) && (
        <div className="flex justify-end flex-col items-end text-right itemmm-hover:invisible">
          <span className="truncate text-xs">{formatDate(new Date(transaction.date), i18n.language)}</span>
          <span className="truncate text-xs font-semibold">{formatCurrency(transaction.amount, currency, i18n.language)}</span>
        </div>
      )}
      {isHovered && !isSelected && (
        <div className="flex justify-end items-end text-right">
          {!transaction.isPaid && (
            <Button title={t('global.cta.pay')} variant="ghost" size="xs" onClick={() => {onPay?.(transaction)}}>
              <CircleCheckBig />
            </Button>
          )}
          <Button title={t('global.cta.edit')} variant="ghost" size="xs" onClick={() => {onEdit?.(transaction)}}>
            <PencilIcon />
          </Button>
          <Button title={t('global.cta.delete')} variant="ghost" size="xs" onClick={() => {}}>
            <Trash />
          </Button>
        </div>
      )}
    </div>
  )
}