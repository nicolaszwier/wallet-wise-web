import { TransactionType } from "./TransactionType"

export interface Category {
  id: string,
  userId: string,
  active: boolean,
  description: string,
  icon: string,
  type: TransactionType
}