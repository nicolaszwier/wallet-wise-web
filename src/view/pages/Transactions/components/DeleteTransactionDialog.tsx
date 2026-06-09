import { Transaction } from '@/app/models/Transaction';
import { Planning } from '@/app/models/Planning';
import { cn } from '@/app/utils/cn';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { Button } from '@/view/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/view/components/ui/dialog';
import { Spinner } from '@/view/components/ui/spinner';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteScope } from '../useTransactionsViewController';

interface Props {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  activeTransaction: Transaction | null;
  selectedPlanning: Planning | undefined;
  isRecurringDelete: boolean;
  deleteScope: DeleteScope;
  setDeleteScope: (scope: DeleteScope) => void;
  isPending: boolean;
  onConfirm: () => void;
}

export function DeleteTransactionDialog({
  isOpen,
  onOpenChange,
  activeTransaction,
  selectedPlanning,
  isRecurringDelete,
  deleteScope,
  setDeleteScope,
  isPending,
  onConfirm,
}: Props) {
  const { t, i18n } = useTranslation();
  const amount = formatCurrency(
    Math.abs(activeTransaction?.amount ?? 0),
    selectedPlanning?.currency ?? 'BRL',
    i18n.language,
  );

  const deleteLabel = deleteScope === 'series'
    ? t('transactions.deleteTransactionDialog.stopRecurring')
    : t('global.cta.delete');

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <DialogTitle>
            {isRecurringDelete
              ? t('transactions.deleteTransactionDialog.recurringTitle')
              : t('transactions.deleteTransactionDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {isRecurringDelete
              ? t('transactions.deleteTransactionDialog.recurringDescription', {
                  description: activeTransaction?.description,
                  amount,
                })
              : t('transactions.deleteTransactionDialog.description', {
                  description: activeTransaction?.description,
                  amount,
                })}
          </DialogDescription>
        </ResponsiveDialogHeader>

        {isRecurringDelete && (
          <div className="flex flex-col gap-2 px-4 pb-2">
            <button
              type="button"
              className={cn(
                'rounded-md border p-3 text-left transition-colors',
                deleteScope === 'occurrence'
                  ? 'border-blue bg-background-tertiary'
                  : 'border-border-light hover:bg-background-tertiary',
              )}
              onClick={() => setDeleteScope('occurrence')}
            >
              <span className="block text-sm font-medium">
                {t('transactions.deleteTransactionDialog.optionOccurrenceOnly')}
              </span>
              <span className="block text-xs text-muted-foreground mt-1">
                {t('transactions.deleteTransactionDialog.optionOccurrenceOnlyHint')}
              </span>
            </button>
            <button
              type="button"
              className={cn(
                'rounded-md border p-3 text-left transition-colors',
                deleteScope === 'series'
                  ? 'border-blue bg-background-tertiary'
                  : 'border-border-light hover:bg-background-tertiary',
              )}
              onClick={() => setDeleteScope('series')}
            >
              <span className="block text-sm font-medium">
                {t('transactions.deleteTransactionDialog.optionStopSeries')}
              </span>
              <span className="block text-xs text-muted-foreground mt-1">
                {t('transactions.deleteTransactionDialog.optionStopSeriesHint')}
              </span>
            </button>
          </div>
        )}

        <ResponsiveDialogFooter className="flex flex-col-reverse">
          <DialogClose asChild>
            <Button variant="ghost">{t('global.cta.cancel')}</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={onConfirm}>
            {isPending && <Spinner />}
            {deleteLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
