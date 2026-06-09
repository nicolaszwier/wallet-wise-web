import { RecurringConfig } from '@/app/models/RecurringConfig';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { Button } from '@/view/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/view/components/ui/dialog';
import { Spinner } from '@/view/components/ui/spinner';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  config: RecurringConfig | null;
  currency: string;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteRecurringConfigDialog({ config, currency, isOpen, onOpenChange, onConfirm, isPending }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <DialogTitle>{t('recurringTransactions.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('recurringTransactions.deleteDialog.description', {
              description: config?.description,
              amount: formatCurrency(Math.abs(config?.amount ?? 0), currency, i18n.language),
            })}
          </DialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter className="flex flex-col-reverse">
          <DialogClose asChild>
            <Button variant="ghost">{t('global.cta.cancel')}</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={onConfirm}>
            {isPending && <Spinner />}
            {t('global.cta.delete')}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
