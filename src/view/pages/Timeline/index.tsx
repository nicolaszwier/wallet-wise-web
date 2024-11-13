import { usePlanning } from "@/app/hooks/usePlanning";
import { BalanceCard } from "@/view/components/BalanceCard";

export default function Timeline() {
  const {selectedPlanning} = usePlanning()

  return (
    <div className="w-full h-full p-2 md:p-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <BalanceCard title="Current balance" amount={selectedPlanning?.currentBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
        <BalanceCard title="Expected balance" amount={selectedPlanning?.expectedBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
      </div>
     
    </div>
  )
}