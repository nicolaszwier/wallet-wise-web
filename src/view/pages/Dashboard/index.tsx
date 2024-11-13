import { usePlanning } from "@/app/hooks/usePlanning";
import { BalanceCard } from "@/view/components/BalanceCard";
import { ChevronRight } from "lucide-react";
import { TransactionsDueThisWeekCard } from "./components/TransactionsDueThisWeekCard";
import { useDashboardController } from "./useDashboardController";
import { Link } from "react-router-dom";
import { BalanceChartCard } from "./components/BalanceChartCard";

export default function Dashboard() {
  const {selectedPlanning} = usePlanning()
  const {transactions, isLoading, balance, isLoadingBalance} = useDashboardController()

  return (
    <div className="w-full h-full p-2 md:p-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <BalanceCard title="Current balance" amount={selectedPlanning?.currentBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard title="Expected balance" amount={selectedPlanning?.expectedBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <Link to={'/timeline'} className="rounded-xl border bg-blue-600 text-white shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">See transactions timeline</div>
            <ChevronRight />
          </div>
          <div className="p-6 pt-0">
            {/* <div className="text-2xl font-bold">{formatCurrency(amount, currency)}</div> */}
          </div>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <TransactionsDueThisWeekCard transactions={transactions} currency={selectedPlanning?.currency || "BRL"} isLoading={isLoading} />
        <BalanceChartCard balance={balance!} currency={selectedPlanning?.currency || "BRL"}  isLoading={isLoadingBalance}/>
      </div>
    </div>
  )
}