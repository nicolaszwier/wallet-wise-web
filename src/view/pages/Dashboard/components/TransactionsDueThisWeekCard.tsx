import { Transaction } from "@/app/models/Transaction";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { formatDate } from "@/app/utils/date";
import { CategoryIcon } from "@/view/components/CategoryIcon";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CardProps {
  isLoading?: boolean;
  transactions: Transaction[],
  currency: string
}

export function TransactionsDueThisWeekCard({transactions, isLoading, currency}: CardProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="rounded-xl border bg-background-secondary text-card-foreground shadow md:col-span-4 lg:col-span-3">
      <Link to={'/timeline'} className="p-6 flex justify-between hover:bg-background-tertiary rounded-xl">
        <div className="flex flex-col space-y-1.5">
          <h1 className="font-semibold leading-none tracking-tight">{t('dashboard.pendingTransactionsCard.title')}</h1>
          <h2 className="text-sm text-muted-foreground">{t('dashboard.pendingTransactionsCard.description')}</h2>
        </div>
        <ChevronRight className="text-muted-foreground"/>
      </Link>
      <div className="p-6 pt-0">
        <ul className="flex flex-col gap-1">
          {transactions.map((el) => (
            <li key={el.id} className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none">  
              <CategoryIcon icon="sdfsd"/>
              <div className="grid flex-1 text-left text-sm">
                <span className="truncate font-semibold">{el.description}</span>
                <span className="truncate text-xs">{el.category?.description}</span>
              </div>
              <div className="flex justify-end flex-col items-end text-right">
                <span className="truncate text-xs">{formatDate(new Date(el.date), i18n.language)}</span>
                <span className="truncate font-semibold">{formatCurrency(el.amount, currency, i18n.language)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}