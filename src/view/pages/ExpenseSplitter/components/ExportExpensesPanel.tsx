import { Button } from '@/view/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { Separator } from '@/view/components/ui/separator';
import { Settlement, SplitExpense, SplitParticipant } from '@/app/models/ExpenseSplitter';
import { TransactionType } from '@/app/models/TransactionType';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { getSettlementKey } from '@/app/utils/expenseSplitter';
import { ExportItem } from '../useExportExpensesController';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';

interface SectionItem {
  key: string;
  label: string;
  amount: number;
  exported: boolean;
  exportItem: ExportItem;
}

interface ExportSectionProps {
  title: string;
  emptyMessage?: string;
  items: SectionItem[];
  amountClassName?: string;
  exportLabel: string;
  exportAllLabel: string;
  exportedLabel: string;
  onExport: (items: ExportItem[], type: TransactionType) => void;
  transactionType: TransactionType;
  currency: string;
  locale: string;
}

function ExportSection({
  title,
  emptyMessage,
  items,
  amountClassName = 'text-red',
  exportLabel,
  exportAllLabel,
  exportedLabel,
  onExport,
  transactionType,
  currency,
  locale,
}: ExportSectionProps) {
  const pending = items.filter((item) => !item.exported);

  if (items.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {pending.length > 1 && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onExport(pending.map((item) => item.exportItem), transactionType)}
          >
            <Upload className="size-4 mr-1" />
            {exportAllLabel}
          </Button>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{item.label}</span>
              <span className={`text-sm font-semibold ${amountClassName}`}>
                {formatCurrency(item.amount, currency, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {item.exported ? (
                <Badge variant="secondary">{exportedLabel}</Badge>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onExport([item.exportItem], transactionType)}
                >
                  {exportLabel}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ExportExpensesPanelProps {
  sessionName: string;
  participants: SplitParticipant[];
  expenses: SplitExpense[];
  myDebts: Settlement[];
  owedToMe: Settlement[];
  exportedSettlementKeys: string[];
  currency: string;
  locale: string;
  onExport: (items: ExportItem[], type: TransactionType) => void;
}

export function ExportExpensesPanel({
  sessionName,
  participants,
  expenses,
  myDebts,
  owedToMe,
  exportedSettlementKeys,
  currency,
  locale,
  onExport,
}: ExportExpensesPanelProps) {
  const { t } = useTranslation();

  const getName = (id: string) => participants.find((p) => p.id === id)?.name ?? '?';

  const paidItems: SectionItem[] = expenses.map((expense) => ({
    key: expense.id,
    label: expense.description,
    amount: expense.amount,
    exported: !!expense.exportedTransactionId,
    exportItem: {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      kind: 'expense',
    },
  }));

  const debtItems: SectionItem[] = myDebts.map((settlement) => {
    const key = getSettlementKey(settlement);
    const toName = getName(settlement.toId);
    return {
      key,
      label: t('expenseSplitter.export.oweTo', { name: toName }),
      amount: settlement.amount,
      exported: exportedSettlementKeys.includes(key),
      exportItem: {
        id: key,
        description: t('expenseSplitter.export.oweDescription', {
          name: toName,
          session: sessionName,
        }),
        amount: settlement.amount,
        kind: 'settlement',
      },
    };
  });

  const owedItems: SectionItem[] = owedToMe.map((settlement) => {
    const key = getSettlementKey(settlement);
    const fromName = getName(settlement.fromId);
    return {
      key,
      label: t('expenseSplitter.export.owedFrom', { name: fromName }),
      amount: settlement.amount,
      exported: exportedSettlementKeys.includes(key),
      exportItem: {
        id: key,
        description: t('expenseSplitter.export.incomeDescription', {
          name: fromName,
          session: sessionName,
        }),
        amount: settlement.amount,
        kind: 'settlement',
      },
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('expenseSplitter.export.walletWiseTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ExportSection
          title={t('expenseSplitter.export.paidTitle')}
          emptyMessage={paidItems.length === 0 ? t('expenseSplitter.export.paidEmpty') : undefined}
          items={paidItems}
          exportLabel={t('expenseSplitter.export.exportExpense')}
          exportAllLabel={t('expenseSplitter.export.exportAll')}
          exportedLabel={t('expenseSplitter.export.exported')}
          onExport={onExport}
          transactionType={TransactionType.EXPENSE}
          currency={currency}
          locale={locale}
        />

        <Separator />

        <ExportSection
          title={t('expenseSplitter.export.oweTitle')}
          emptyMessage={debtItems.length === 0 ? t('expenseSplitter.export.oweEmpty') : undefined}
          items={debtItems}
          exportLabel={t('expenseSplitter.export.exportExpense')}
          exportAllLabel={t('expenseSplitter.export.exportAll')}
          exportedLabel={t('expenseSplitter.export.exported')}
          onExport={onExport}
          transactionType={TransactionType.EXPENSE}
          currency={currency}
          locale={locale}
        />

        <Separator />

        <ExportSection
          title={t('expenseSplitter.export.owedTitle')}
          emptyMessage={owedItems.length === 0 ? t('expenseSplitter.export.owedEmpty') : undefined}
          items={owedItems}
          amountClassName="text-green"
          exportLabel={t('expenseSplitter.export.exportIncome')}
          exportAllLabel={t('expenseSplitter.export.exportAllIncome')}
          exportedLabel={t('expenseSplitter.export.exported')}
          onExport={onExport}
          transactionType={TransactionType.INCOME}
          currency={currency}
          locale={locale}
        />
      </CardContent>
    </Card>
  );
}
