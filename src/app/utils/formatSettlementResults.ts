import {
  ParticipantBalance,
  Settlement,
  SplitExpense,
  SplitParticipant,
} from '@/app/models/ExpenseSplitter';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { getSettlementKey } from '@/app/utils/expenseSplitter';

interface FormatSettlementResultsOptions {
  sessionName: string;
  settlements: Settlement[];
  balances: ParticipantBalance[];
  participants: SplitParticipant[];
  expenses: SplitExpense[];
  includeExpenses: boolean;
  paidSettlementKeys: string[];
  currency: string;
  locale: string;
  labels: {
    title: string;
    expenses: string;
    paidBy: string;
    sharedWith: string;
    settlements: string;
    owes: string;
    paid: string;
    netBalance: string;
    allSettled: string;
  };
}

function getName(participants: SplitParticipant[], id: string): string {
  return participants.find((p) => p.id === id)?.name ?? '?';
}

export function formatSettlementResultsText({
  sessionName,
  settlements,
  balances,
  participants,
  expenses,
  includeExpenses,
  paidSettlementKeys,
  currency,
  locale,
  labels,
}: FormatSettlementResultsOptions): string {
  const lines: string[] = [`${labels.title} — ${sessionName}`, ''];

  if (includeExpenses && expenses.length > 0) {
    lines.push(`${labels.expenses}:`);

    for (const expense of expenses) {
      const payer = getName(participants, expense.payerId);
      const amount = formatCurrency(expense.amount, currency, locale);
      const sharedNames = expense.participantIds
        .map((id) => getName(participants, id))
        .join(', ');

      lines.push(
        `• ${expense.description} — ${labels.paidBy.replace('{{name}}', payer)}: ${amount} (${labels.sharedWith}: ${sharedNames})`,
      );
    }

    lines.push('');
  }

  if (settlements.length === 0) {
    if (!(includeExpenses && expenses.length > 0)) {
      lines.push(labels.allSettled);
    }
    return lines.join('\n');
  }

  lines.push(`${labels.settlements}:`);

  for (const settlement of settlements) {
    const key = getSettlementKey(settlement);
    const isPaid = paidSettlementKeys.includes(key);
    const from = getName(participants, settlement.fromId);
    const to = getName(participants, settlement.toId);
    const amount = formatCurrency(settlement.amount, currency, locale);
    const paidSuffix = isPaid ? ` (${labels.paid})` : '';

    lines.push(`• ${from} ${labels.owes} ${to}: ${amount}${paidSuffix}`);
  }

  lines.push('', `${labels.netBalance}:`);

  for (const balance of balances) {
    const name = getName(participants, balance.participantId);
    const prefix = balance.balance >= 0 ? '+' : '';
    const amount = formatCurrency(balance.balance, currency, locale);
    lines.push(`${name}: ${prefix}${amount}`);
  }

  return lines.join('\n');
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyTextToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}
