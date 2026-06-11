import { DELETE_ACCOUNT_CONFIRMATION_PHRASE } from '../useDeleteAccountController';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { Button } from '@/view/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/view/components/ui/dialog';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Spinner } from '@/view/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  confirmationInput: string;
  onConfirmationInputChange: (value: string) => void;
  canConfirm: boolean;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteAccountDialog({
  isOpen,
  onOpenChange,
  confirmationInput,
  onConfirmationInputChange,
  canConfirm,
  onConfirm,
  isPending,
}: DeleteAccountDialogProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-muted-foreground" />
            <DialogTitle>{t('deleteAccount.confirmTitle')}</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {t('deleteAccount.confirmDescription')}
          </DialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="rounded-lg border bg-background-secondary p-4 text-sm">
            <p className="font-medium">{t('deleteAccount.warningTitle')}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
              <li>{t('deleteAccount.warningPlannings')}</li>
              <li>{t('deleteAccount.warningTransactions')}</li>
              <li>{t('deleteAccount.warningCategories')}</li>
              <li>{t('deleteAccount.warningIrreversible')}</li>
            </ul>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delete-confirmation">
              {t('deleteAccount.confirmInputLabel', { phrase: DELETE_ACCOUNT_CONFIRMATION_PHRASE })}
            </Label>
            <Input
              id="delete-confirmation"
              value={confirmationInput}
              onChange={(event) => onConfirmationInputChange(event.target.value)}
              placeholder={DELETE_ACCOUNT_CONFIRMATION_PHRASE}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <ResponsiveDialogFooter className="flex flex-col-reverse">
          <DialogClose asChild>
            <Button variant="ghost">{t('global.cta.cancel')}</Button>
          </DialogClose>
          <Button variant="destructive" disabled={!canConfirm || isPending} onClick={onConfirm}>
            {isPending && <Spinner />}
            {t('deleteAccount.confirmCta')}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
