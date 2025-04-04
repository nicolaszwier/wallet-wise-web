import { Transaction } from "../models/Transaction";
import { TransactionType } from "../models/TransactionType";

export function sumPendingTransactionsByType(transactions: Transaction[], type: TransactionType): number {
  return transactions.filter(el => el.type === type && !el.isPaid).reduce((prev, curr,)=> {
    return prev + Math.abs(curr.amount)
  },0)
}