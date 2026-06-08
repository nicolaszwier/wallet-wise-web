export interface SplitParticipant {
  id: string;
  name: string;
  linkedUserId?: string;
}

export interface SplitExpense {
  id: string;
  description: string;
  amount: number;
  payerId: string;
  participantIds: string[];
  exportedTransactionId?: string;
}

export interface SplitSession {
  id: string;
  name: string;
  currency: string;
  participants: SplitParticipant[];
  expenses: SplitExpense[];
  paidSettlementKeys?: string[];
  exportedSettlementKeys?: string[];
  updatedAt: string;
}

export interface SplitSessionStore {
  activeSessionId: string;
  sessions: SplitSession[];
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

export interface ParticipantBalance {
  participantId: string;
  balance: number;
}
