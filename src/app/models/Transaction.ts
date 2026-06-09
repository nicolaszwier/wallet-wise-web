import { Category } from "./Category";
import { TransactionType } from "./TransactionType";

export interface Transaction {
  id: string;
  periodId?: string;
  planningId: string;
  categoryId: string;
  description: string;
  amount: number;
  date: string;
  dateCreated?: string;
  isPaid: boolean;
  type: TransactionType;
  category?: Category;
  recurringConfigId?: string;
}

export interface CreateTransactionPayload {
  planningId: string;
  categoryId: string;
  description: string;
  amount: number;
  date: string;
  isPaid: boolean;
  type: TransactionType;
  isRecurring?: boolean;
  frequency?: string;
  endDate?: string;
}