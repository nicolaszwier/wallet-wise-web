import { formatCurrency } from "@/app/utils/formatCurrency";
import { CircleDollarSign } from "lucide-react";

interface CardProps {
  isLoading?: boolean;
  title: string,
  amount: number,
  currency: string
}

export function BalanceCard({title, amount, currency}: CardProps) {

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="tracking-tight text-sm font-medium">{title}</div>
      <CircleDollarSign />
    </div>
    <div className="p-6 pt-0">
      <div className="text-2xl font-bold">{formatCurrency(amount, currency)}</div>
    </div>
  </div>
  )
}