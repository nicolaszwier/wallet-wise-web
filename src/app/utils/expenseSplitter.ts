import {
  ParticipantBalance,
  Settlement,
  SplitExpense,
  SplitParticipant,
} from '@/app/models/ExpenseSplitter';

function roundAmount(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateBalances(
  participants: SplitParticipant[],
  expenses: SplitExpense[],
): ParticipantBalance[] {
  const balances = new Map<string, number>(
    participants.map((p) => [p.id, 0]),
  );

  for (const expense of expenses) {
    if (
      expense.amount <= 0 ||
      expense.participantIds.length < 2 ||
      !expense.participantIds.includes(expense.payerId)
    ) {
      continue;
    }

    const share = expense.amount / expense.participantIds.length;

    for (const participantId of expense.participantIds) {
      const current = balances.get(participantId) ?? 0;
      if (participantId === expense.payerId) {
        balances.set(participantId, current + expense.amount - share);
      } else {
        balances.set(participantId, current - share);
      }
    }
  }

  return participants.map((p) => ({
    participantId: p.id,
    balance: roundAmount(balances.get(p.id) ?? 0),
  }));
}

export function calculateSettlements(
  participants: SplitParticipant[],
  expenses: SplitExpense[],
): Settlement[] {
  const owed = new Map<string, number>();
  const pairKey = (fromId: string, toId: string) => `${fromId}|${toId}`;

  for (const expense of expenses) {
    if (!isValidExpense(expense)) continue;

    const share = expense.amount / expense.participantIds.length;

    for (const participantId of expense.participantIds) {
      if (participantId === expense.payerId) continue;
      const key = pairKey(participantId, expense.payerId);
      owed.set(key, roundAmount((owed.get(key) ?? 0) + share));
    }
  }

  const seenPairs = new Set<string>();
  const settlements: Settlement[] = [];

  for (const [key, amountAB] of owed) {
    const [a, b] = key.split('|');
    const unordered = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (seenPairs.has(unordered)) continue;
    seenPairs.add(unordered);

    const amountBA = owed.get(pairKey(b, a)) ?? 0;
    const net = roundAmount(amountAB - amountBA);

    if (net > 0.001) {
      settlements.push({ fromId: a, toId: b, amount: net });
    } else if (net < -0.001) {
      settlements.push({ fromId: b, toId: a, amount: roundAmount(Math.abs(net)) });
    }
  }

  return settlements.sort((a, b) => {
    const fromCmp = getParticipantName(participants, a.fromId).localeCompare(
      getParticipantName(participants, b.fromId),
    );
    if (fromCmp !== 0) return fromCmp;
    return getParticipantName(participants, a.toId).localeCompare(
      getParticipantName(participants, b.toId),
    );
  });
}

function getParticipantName(participants: SplitParticipant[], id: string): string {
  return participants.find((p) => p.id === id)?.name ?? id;
}

export function getSettlementKey(settlement: Settlement): string {
  return `${settlement.fromId}|${settlement.toId}|${settlement.amount}`;
}

export function canShowResults(participants: SplitParticipant[]): boolean {
  return participants.length >= 2;
}

export function isValidExpense(expense: SplitExpense): boolean {
  return (
    expense.amount > 0 &&
    expense.participantIds.length >= 2 &&
    expense.participantIds.includes(expense.payerId)
  );
}
