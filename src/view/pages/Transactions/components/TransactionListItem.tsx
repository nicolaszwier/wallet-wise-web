import { useIsMobile } from "@/app/hooks/useIsMobile"
import { Transaction } from "@/app/models/Transaction"
import { cn } from "@/app/utils/cn"
import { formatDate, isAfterCurrentDate } from "@/app/utils/date"
import { formatCurrency } from "@/app/utils/formatCurrency"
import { CategoryIcon } from "@/view/components/CategoryIcon"
import { SwipeToRevealActions } from "@/view/components/SwipeToReveal"
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
  onDelete?: (transaction: Transaction) => void
}

export function TransactionListItem({transaction, currency, isSelected, onSelect, onEdit, onPay, onDelete }: ComponentProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SwipeToRevealActions
        actionButtons={[
          {
            content: (
              <div title={t('global.cta.pay')} className="flex items-center justify-center bg-green text-white h-full w-full">
                <CircleCheckBig size={18}/>
              </div>
            ),
            onClick: () => {onPay?.(transaction)},
            hidden: transaction.isPaid
          },
          {
            content: (
              <div title={t('global.cta.edit')} className="flex items-center justify-center bg-blue text-white h-full w-full">
                <PencilIcon size={18}/>
              </div>
            ),
            onClick: () => {onEdit?.(transaction)},
          },
          {
            content: (
              <div title={t('global.cta.delete')} className="flex items-center justify-center bg-red text-white h-full w-full">
                <Trash size={18}/>
              </div>
            ),
            onClick: () => {onDelete?.(transaction)},
          },
        ]}
        actionButtonMinWidth={56}
        hideDotsButton
        // onOpen={() => console.log('Item opened')}
        // onClose={() => console.log('Item closed')}
      >
        <ItemContent 
          currency={currency}
          transaction={transaction}
          isSelected={isSelected}
          onEdit={onEdit}
          onPay={onPay}
          onSelect={onSelect}
          isMobile={isMobile}
        />
      </SwipeToRevealActions>
    )
  }

  return (
    <ItemContent 
      currency={currency}
      transaction={transaction}
      isSelected={isSelected}
      isMobile={isMobile}
      onEdit={onEdit}
      onPay={onPay}
      onDelete={onDelete}
      onSelect={onSelect}
    />
  )
}

function ItemContent({transaction, currency, isSelected, onSelect, onEdit, onPay, onDelete, isMobile }: ComponentProps & { isMobile: boolean }) {
  const { t, i18n } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  const handleCheckedChange = () => {
    onSelect?.(transaction)
  }

  return (
    <div className={cn(
      "flex w-full items-center gap-2 overflow-hidden rounded-md p-3 py-3 cursor-default text-left outline-none hover:bg-background-tertiary transition-all",
      isSelected ? "bg-background-tertiary hover:bg-background-tertiary" : "bg-background-secondary " 
    )}
      onMouseEnter={() => {
        if (!isMobile) {
          setIsHovered(true)
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsHovered(false)
        }
      }}
    > 
    {!isHovered && !isSelected ? (
      <CategoryIcon 
        size={17} 
        icon={transaction.category?.icon ?? ''}
        onClick={handleCheckedChange}
      />
    ) : (
      <div className="w-[33px] flex justify-center">
        <Checkbox className="w-7 h-7" checked={isSelected} onCheckedChange={handleCheckedChange}/>
      </div>
    )}
      <div className="grid flex-1 text-left">
        <span className="break-normal text-xs font-semibold">{transaction.description}</span>
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
      {(!isHovered || isSelected || isMobile) && (
        <div className="flex justify-end flex-col items-end text-right">
          <span className="truncate text-xs">{formatDate(new Date(transaction.date), i18n.language)}</span>
          <span className="truncate text-xs font-semibold">{formatCurrency(transaction.amount, currency, i18n.language)}</span>
        </div>
      )}
      {!isMobile && isHovered && !isSelected && (
        <div className="flex justify-end items-end text-right">
          {!transaction.isPaid && (
            <Button title={t('global.cta.pay')} variant="ghost" size="xs" onClick={() => {onPay?.(transaction)}}>
              <CircleCheckBig />
            </Button>
          )}
          <Button title={t('global.cta.edit')} variant="ghost" size="xs" onClick={() => {onEdit?.(transaction)}}>
            <PencilIcon />
          </Button>
          <Button title={t('global.cta.delete')} variant="ghost" size="xs" onClick={() => {onDelete?.(transaction)}}>
            <Trash />
          </Button>
        </div>
      )}
    </div>
  )
}