import { usePlanning } from "@/app/hooks/usePlanning";
import { BalanceCard } from "@/view/components/BalanceCard";
import { TransactionsDueThisWeekCard } from "./components/TransactionsDueThisWeekCard";
import { useDashboardController } from "./useDashboardController";
import { BalanceChartCard } from "./components/BalanceChartCard";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation()
  const {selectedPlanning} = usePlanning()
  const {transactions, isLoading, balance, isLoadingBalance} = useDashboardController()

  return (
    <div className="w-full h-full p-2 md:p-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <BalanceCard variant="default" title={t('global.currentBalance')} amount={selectedPlanning?.currentBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard variant="default" title={t('global.expectedBalance')} amount={selectedPlanning?.expectedBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard variant="default" title={t('global.toPay')} amount={0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard variant="default" title={t('global.toReceive')} amount={0} currency={selectedPlanning?.currency || "BRL"}/>
        {/* <Link to={'/timeline'} className="rounded-xl border bg-blue-600 text-white shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">See transactions timeline</div>
            <ChevronRight />
          </div>
          <div className="p-6 pt-0">
          </div>
        </Link> */}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <TransactionsDueThisWeekCard transactions={transactions} currency={selectedPlanning?.currency || "BRL"} isLoading={isLoading} />
        <BalanceChartCard balance={balance!} currency={selectedPlanning?.currency || "BRL"}  isLoading={isLoadingBalance}/>
      </div>
    </div>
  )
}