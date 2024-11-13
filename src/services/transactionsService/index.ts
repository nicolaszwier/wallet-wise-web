
import { Transaction } from "@/app/models/Transaction";
import { httpClient } from "../httpClient";
import { Balance } from "@/app/models/Balance";

export const transactionsService = {
  fetchDueThisWeek,
  fetchMonthlyBalance
};

type TransactionsResponse = Transaction[];
type BalanceResponse = Balance

async function fetchDueThisWeek(planningId: string) {
  const { data } = await httpClient.get<TransactionsResponse>(`/transactions/due-this-week/${planningId}`,);
  return data;
}

async function fetchMonthlyBalance(planningId: string, month?: string, year?: string) {
  const params = {
    month, year
  }
  const { data } = await httpClient.get<BalanceResponse>(`/transactions/monthly_balance/${planningId}`, {params});
  return data;
}
