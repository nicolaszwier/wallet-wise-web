import { usePlanning } from "@/app/hooks/usePlanning";
import { BalanceCard } from "@/view/components/BalanceCard";
import { TransactionsDueThisWeekCard } from "./components/TransactionsDueThisWeekCard";
import { useDashboardController } from "./useDashboardController";
import { BalanceChartCard } from "./components/BalanceChartCard";
import { FirstTransactionCard } from "./components/FirstTransactionCard";
import { useFirstTransactionPrompt } from "./useFirstTransactionPrompt";
import { NewTransactionDialog } from "@/view/pages/Transactions/components/NewTransactionDialog";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation()
  const {selectedPlanning} = usePlanning()
  const {transactions, isLoading, balance, isLoadingBalance, refetchTransactions, refetchBalance} = useDashboardController()
  const { isPending, dialogOpen, setDialogOpen, handleSuccess } = useFirstTransactionPrompt()

  const onTransactionCreated = () => {
    handleSuccess();
    refetchTransactions();
    refetchBalance();
  };

  return (
    <div className="w-full h-full p-2 md:p-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <BalanceCard variant="default" title={t('global.currentBalance')} amount={selectedPlanning?.currentBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard variant="default" title={t('global.expectedBalance')} amount={selectedPlanning?.expectedBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard variant="default" title={t('global.toPay')} amount={0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard variant="default" title={t('global.toReceive')} amount={0} currency={selectedPlanning?.currency || "BRL"}/>
      </div>

      {isPending && (
        <div className="mt-4 max-w-lg">
          <FirstTransactionCard onAddTransaction={() => setDialogOpen(true)} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4 pb-10">
        <TransactionsDueThisWeekCard transactions={transactions} currency={selectedPlanning?.currency || "BRL"} isLoading={isLoading} />
        <BalanceChartCard balance={balance!} currency={selectedPlanning?.currency || "BRL"} isLoading={isLoadingBalance}/>
      </div>

      <NewTransactionDialog
        showTrigger={false}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={onTransactionCreated}
      />
    </div>
  )
}