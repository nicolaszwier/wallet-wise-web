import { Button } from '@/view/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/view/components/ui/collapsible';
import { Checkbox } from '@/view/components/ui/checkbox';
import { Label } from '@/view/components/ui/label';
import { ParticipantBalance, Settlement, SplitExpense, SplitParticipant } from '@/app/models/ExpenseSplitter';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { getSettlementKey } from '@/app/utils/expenseSplitter';
import {
  copyTextToClipboard,
  downloadTextFile,
  formatSettlementResultsText,
} from '@/app/utils/formatSettlementResults';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Copy, Download } from 'lucide-react';
import { cn } from '@/app/utils/cn';
import toast from 'react-hot-toast';
import { useCallback, useState } from 'react';

interface SettlementResultsProps {
  sessionName: string;
  settlements: Settlement[];
  balances: ParticipantBalance[];
  participants: SplitParticipant[];
  expenses: SplitExpense[];
  paidSettlementKeys: string[];
  currency: string;
  locale: string;
  showResults: boolean;
  onTogglePaid: (settlementKey: string) => void;
}

export function SettlementResults({
  sessionName,
  settlements,
  balances,
  participants,
  expenses,
  paidSettlementKeys,
  currency,
  locale,
  showResults,
  onTogglePaid,
}: SettlementResultsProps) {
  const { t } = useTranslation();
  const [includeExpenses, setIncludeExpenses] = useState(false);

  const getName = (id: string) => participants.find((p) => p.id === id)?.name ?? '?';

  const buildShareText = useCallback(
    () =>
      formatSettlementResultsText({
        sessionName,
        settlements,
        balances,
        participants,
        expenses,
        includeExpenses,
        paidSettlementKeys,
        currency,
        locale,
        labels: {
          title: t('expenseSplitter.title'),
          expenses: t('expenseSplitter.expenses'),
          paidBy: t('expenseSplitter.paidBy', { name: '{{name}}' }),
          sharedWith: t('expenseSplitter.share.sharedWith'),
          settlements: t('expenseSplitter.results'),
          owes: t('expenseSplitter.owes'),
          paid: t('expenseSplitter.paid'),
          netBalance: t('expenseSplitter.netBalance'),
          allSettled: t('expenseSplitter.allSettled'),
        },
      }),
    [
      sessionName,
      settlements,
      balances,
      participants,
      expenses,
      includeExpenses,
      paidSettlementKeys,
      currency,
      locale,
      t,
    ],
  );

  const handleCopy = useCallback(async () => {
    const success = await copyTextToClipboard(buildShareText());
    if (success) {
      toast.success(t('expenseSplitter.share.copySuccess'), { position: 'bottom-center' });
    } else {
      toast.error(t('expenseSplitter.share.copyError'), { position: 'bottom-center' });
    }
  }, [buildShareText, t]);

  const handleExport = useCallback(() => {
    const content = buildShareText();
    const filename = `${sessionName.replace(/[^\w\s-]/g, '').trim() || 'expense-split'}.txt`;
    downloadTextFile(content, filename);
    toast.success(t('expenseSplitter.share.exportSuccess'), { position: 'bottom-center' });
  }, [buildShareText, sessionName, t]);

  if (!showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('expenseSplitter.results')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('expenseSplitter.needTwoParticipants')}</p>
        </CardContent>
      </Card>
    );
  }

  const hasSettlements = settlements.length > 0;
  const canShare = hasSettlements || expenses.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>{t('expenseSplitter.results')}</CardTitle>
        {canShare && (
          <div className="flex flex-col gap-2 sm:items-end">
            {expenses.length > 0 && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={includeExpenses}
                  onCheckedChange={(checked) => setIncludeExpenses(checked === true)}
                />
                <Label className="cursor-pointer font-normal">
                  {t('expenseSplitter.share.includeExpenses')}
                </Label>
              </label>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="size-4 mr-1" />
                {t('expenseSplitter.share.copy')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleExport}>
                <Download className="size-4 mr-1" />
                {t('expenseSplitter.share.export')}
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!hasSettlements ? (
          <p className="text-sm text-muted-foreground">{t('expenseSplitter.allSettled')}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {settlements.map((s) => {
              const key = getSettlementKey(s);
              const isPaid = paidSettlementKeys.includes(key);

              return (
                <li
                  key={key}
                  className={cn(
                    'flex items-center gap-3 rounded-md border px-3 py-2 text-sm',
                    isPaid && 'opacity-70',
                  )}
                >
                  <Checkbox
                    checked={isPaid}
                    onCheckedChange={() => onTogglePaid(key)}
                    aria-label={t('expenseSplitter.markAsPaid', {
                      from: getName(s.fromId),
                      to: getName(s.toId),
                    })}
                  />
                  <span
                    className={cn(
                      'flex flex-1 items-center justify-between gap-2',
                      isPaid && 'line-through text-muted-foreground',
                    )}
                  >
                    <span>
                      <strong>{getName(s.fromId)}</strong>{' '}
                      {t('expenseSplitter.owes')}{' '}
                      <strong>{getName(s.toId)}</strong>
                    </span>
                    <span className="font-semibold shrink-0">
                      {formatCurrency(s.amount, currency, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronDown className="size-4" />
            {t('expenseSplitter.netBalance')}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="flex flex-col gap-1">
              {balances.map((b) => (
                <li key={b.participantId} className="flex justify-between text-sm px-1">
                  <span>{getName(b.participantId)}</span>
                  <span
                    className={cn(
                      'font-medium',
                      b.balance > 0 && 'text-green',
                      b.balance < 0 && 'text-red',
                    )}
                  >
                    {b.balance >= 0 ? '+' : ''}
                    {formatCurrency(b.balance, currency, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
