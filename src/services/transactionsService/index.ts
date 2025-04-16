
import { Transaction } from "@/app/models/Transaction";
import { httpClient } from "../httpClient";
import { Balance } from "@/app/models/Balance";

export const transactionsService = {
  fetchDueThisWeek,
  fetchMonthlyBalance,
  create,
  update,
  pay,
  remove
};

type TransactionsResponse = Transaction[];
type BalanceResponse = Balance;
type TransactionPayload = Transaction;

interface DefaultResponse {
  statusCode: number;
  message: string;
  error?: string;
}

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

export async function create(payload: TransactionPayload) {
  const { data } = await httpClient.post<DefaultResponse>('/transactions', payload);
  return data;
}

export async function update(payload: TransactionPayload) {
  const { data } = await httpClient.put<DefaultResponse>(`/transactions/${payload.id}`, payload);
  return data;
}

export async function pay(periodId: string, transactionId: string) {
  const { data } = await httpClient.put<DefaultResponse>(`/transactions/pay/${periodId}/${transactionId}`);
  return data;
}

export async function remove(periodId: string, transactionId: string) {
  const { data } = await httpClient.delete<DefaultResponse>(`/transactions/${periodId}/${transactionId}`);
  return data;
}
