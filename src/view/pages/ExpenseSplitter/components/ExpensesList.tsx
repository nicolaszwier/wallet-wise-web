import { Button } from '@/view/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { SplitExpense, SplitParticipant } from '@/app/models/ExpenseSplitter';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

interface ExpensesListProps {
  expenses: SplitExpense[];
  participants: SplitParticipant[];
  currency: string;
  locale: string;
  onRemove: (id: string) => void;
}

export function ExpensesList({
  expenses,
  participants,
  currency,
  locale,
  onRemove,
}: ExpensesListProps) {
  const { t } = useTranslation();

  const getName = (id: string) => participants.find((p) => p.id === id)?.name ?? '?';

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('expenseSplitter.expenses')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('expenseSplitter.emptyExpenses')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('expenseSplitter.expenses')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex items-start justify-between gap-2 rounded-md border px-3 py-2"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-medium truncate">{expense.description}</span>
                <span className="text-sm text-muted-foreground">
                  {t('expenseSplitter.paidBy', { name: getName(expense.payerId) })}
                  {' · '}
                  {expense.participantIds.length} {t('expenseSplitter.participants').toLowerCase()}
                </span>
                <span className="text-sm font-semibold text-red">
                  {formatCurrency(expense.amount, currency, locale)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(expense.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
