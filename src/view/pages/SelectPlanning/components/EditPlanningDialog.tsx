import { Planning } from '@/app/models/Planning';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { Button } from '@/view/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/view/components/ui/dialog';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Spinner } from '@/view/components/ui/spinner';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface EditPlanningDialogProps {
  planning: Planning | null;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  name: string;
  onNameChange: (value: string) => void;
  nameError?: string;
  onSubmit: () => void;
  isPending: boolean;
}

export function EditPlanningDialog({
  planning,
  open,
  onOpenChange,
  name,
  onNameChange,
  nameError,
  onSubmit,
  isPending,
}: EditPlanningDialogProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <DialogTitle>{t('selectPlanning.editDialog.title')}</DialogTitle>
          <DialogDescription>{t('selectPlanning.editDialog.description')}</DialogDescription>
        </ResponsiveDialogHeader>

        <div className="grid gap-4 px-4 sm:px-0">
          <div className="grid gap-2">
            <Label htmlFor="edit-planning-name">{t('onboarding.step4.planningName')}</Label>
            <Input
              id="edit-planning-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t('onboarding.step4.planningNamePlaceholder')}
            />
            {nameError && (
              <span className="text-sm text-destructive">{t(nameError)}</span>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border bg-background-tertiary px-3 py-2 text-sm">
            <span className="text-muted-foreground">{t('onboarding.step4.currency')}</span>
            <span className="font-medium">{planning?.currency}</span>
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
