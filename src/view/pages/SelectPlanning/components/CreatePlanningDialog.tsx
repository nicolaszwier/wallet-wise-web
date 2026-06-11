import { CurrencyOption } from '@/services/planningsService/fetchCurrencies';
import { CurrencyPickerField } from '@/view/components/CurrencyPickerField';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { Button } from '@/view/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/view/components/ui/dialog';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Spinner } from '@/view/components/ui/spinner';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface CreatePlanningDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  name: string;
  onNameChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  currencies: CurrencyOption[] | undefined;
  isLoadingCurrencies: boolean;
  nameError?: string;
  onSubmit: () => void;
  isPending: boolean;
}

export function CreatePlanningDialog({
  open,
  onOpenChange,
  name,
  onNameChange,
  currency,
  onCurrencyChange,
  currencies,
  isLoadingCurrencies,
  nameError,
  onSubmit,
  isPending,
}: CreatePlanningDialogProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <DialogTitle>{t('selectPlanning.createDialog.title')}</DialogTitle>
          <DialogDescription>{t('selectPlanning.createDialog.description')}</DialogDescription>
        </ResponsiveDialogHeader>

        <div className="grid gap-4 px-4 sm:px-0">
          <div className="grid gap-2">
            <Label htmlFor="create-planning-name">{t('onboarding.step4.planningName')}</Label>
            <Input
              id="create-planning-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t('onboarding.step4.planningNamePlaceholder')}
            />
            {nameError && (
              <span className="text-sm text-destructive">{t(nameError)}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-planning-currency">{t('onboarding.step4.currency')}</Label>
            {isLoadingCurrencies ? (
              <div className="flex h-11 items-center justify-center rounded-md border bg-background-tertiary">
                <Spinner />
              </div>
            ) : (
              <CurrencyPickerField
                id="create-planning-currency"
                value={currency}
                currencies={currencies ?? []}
                onChange={onCurrencyChange}
                placeholder={t('onboarding.step4.currency')}
              />
            )}
          </div>
        </div>

        <ResponsiveDialogFooter className="flex flex-col-reverse">
          <DialogClose asChild>
            <Button variant="ghost">{t('global.cta.cancel')}</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={onSubmit}>
            {isPending && <Spinner />}
            {t('global.cta.submit')}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
