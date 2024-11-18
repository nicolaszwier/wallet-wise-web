import { Transaction } from "./Transaction";

export interface Period {
  id: string;
  userId: string;
  planningId: string;
  periodBalance: number;
  periodBalancePaidOnly: number;
  expectedAllTimeBalance: number;
  expectedAllTimeBalancePaidOnly: number;
  periodEnd: string;
  periodStart: string;
  transactions: Transaction[]
}