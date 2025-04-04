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
  category?: Category
}