import { cn } from "@/app/utils/cn";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { CircleDollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CardProps {
  isLoading?: boolean;
  title: string,
  amount: number,
  currency: string
  variant: 'sm' | 'default',
  className?: string
}

export function BalanceCard({title, amount, currency, variant, className}: CardProps) {
  const { i18n } = useTranslation()

  return (
    <>
    {variant === 'default' && (
      <div className={cn(
        "rounded-xl border bg-background-secondary text-card-foreground shadow-sm hover:bg-background-secondary/15",
        className
      )}>
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="tracking-tight text-sm font-medium text-muted-foreground">{title}</div>
          <CircleDollarSign />
        </div>
        <div className="p-6 pt-0">
          <div className="text-1xl font-bold">{formatCurrency(amount, currency, i18n.language)}</div>
        </div>
      </div>
    )}
    {variant === 'sm' && (
      <div className="">
        <div className="flex flex-row items-center justify-between space-y-0">
          <div className="tracking-tight text-xs font-medium text-muted-foreground">{title}</div>
        </div>
        <div className="pt-0">
          <div className="text-sm font-bold">{formatCurrency(amount, currency, i18n.language)}</div>
        </div>
      </div>
    )}
    </>
  )
}