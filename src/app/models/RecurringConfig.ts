import { RecurrenceFrequency } from './RecurrenceFrequency';
import { TransactionType } from './TransactionType';

export interface RecurringConfig {
  id: string;
  userId: string;
  planningId: string;
  categoryId: string;
  amount: number;
  description: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string | null;
  recurringDay: number;
  lastGeneratedDate?: string | null;
  active: boolean;
  dateCreated: string;
}

export interface CreateRecurringConfigPayload {
  planningId: string;
  categoryId: string;
  description: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
}

export type UpdateRecurringConfigPayload = Partial<Omit<CreateRecurringConfigPayload, 'endDate'>> & {
  endDate?: string | null;
};
