import { TransactionType } from "./TransactionType";

export interface Balance {
  year: number;
  month: number;
  expenses: number;
  expensesPaidOnly: number;
  incomes: number;
  incomesPaidOnly: number;
  categories: BalanceCategory[];
}

export interface BalanceCategory {
  categoryId: string;
  type: TransactionType;
  description: string;
  icon: string;
  balance: number;
  balancePaidOnly: number;
}