import { useTransactions } from "@/app/hooks/useTransactions";
import { Planning } from "@/app/models/Planning";
import { BalanceCard } from "@/view/components/BalanceCard";
import { Button } from "@/view/components/ui/button";
import { Eye, EyeOff, ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ComponentProps {
  selectedPlanning: Planning | undefined

}
export function TransactionsToolbar({selectedPlanning}: ComponentProps) {
  const { t } = useTranslation()
  const { 
    showEmptyPeriods, 
    toggleFilterTransactionsDialog, 
    toggleShowEmptyPeriods 
  } = useTransactions()

  return (
    <div className='flex h-full'>

      <Button variant="ghost" title={t(showEmptyPeriods ? 'a11y.hideEmptyPeriods' : 'a11y.showEmptyPeriods')} size="icon" onClick={toggleShowEmptyPeriods}>
        {showEmptyPeriods ? <Eye/> : <EyeOff />}
      </Button>
      <Button variant="ghost" size="icon" onClick={() => toggleFilterTransactionsDialog(true)}>
        <ListFilter />
      </Button>
      <BalanceCard className="ml-4" variant='sm' title={t('global.currentBalance')} amount={selectedPlanning?.currentBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
    {/* <Separator orientation='vertical'  />
    <BalanceCard variant='sm' title={t('global.expectedBalance')} amount={selectedPlanning?.expectedBalance || 0} currency={selectedPlanning?.currency || "BRL"}/> */}
    </div>
  )
}