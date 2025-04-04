import { usePlanning } from "@/app/hooks/usePlanning";
import { useTransactions } from "@/app/hooks/useTransactions";
import { cn } from "@/app/utils/cn";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Button } from "@/view/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/view/components/ui/card";
import { CopyPlus, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SelectionModePopover() {
  const { selectedTransactions, selectedTransactionsTotal, clearSelectedTransactions } = useTransactions()
  const {selectedPlanning} = usePlanning()
  const { t, i18n } = useTranslation()

  return (
    <Card className="bg-background-tertiary min-w[250px] w-full max-w-[500px] shadow-lg">
      <CardHeader className="flex justify-between">
      </CardHeader>
      <CardContent>
        <CardDescription className="md:text-base flex justify-between">
          <span>
            {
              selectedTransactions.length === 1
              ? t('transactions.selectedTransaction', {amount: 1}) 
              : t('transactions.selectedTransactions', {amount: selectedTransactions.length})
            }
          </span>
          <span className={cn("font-bold text-md md:text-2xl", selectedTransactionsTotal >= 0 ? "text-green" : "text-red")}>{formatCurrency(selectedTransactionsTotal, selectedPlanning?.currency ?? "BRL", i18n.language)}</span>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="ghost" onClick={clearSelectedTransactions}>{t('global.cta.cancel')}</Button>
        <div className="flex gap-2">
          <Button variant="secondary"><CopyPlus /> {t('global.cta.duplicate')}</Button>
          <Button variant="secondary"><Trash />{t('global.cta.delete')}</Button>
        </div>
      </CardFooter>
    </Card>
  )
}