import { Planning } from '@/app/models/Planning';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { Button } from '@/view/components/ui/button';
import { DialogClose, DialogDescription, DialogTitle } from '@/view/components/ui/dialog';
import { Spinner } from '@/view/components/ui/spinner';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface DeletePlanningDialogProps {
  planning: Planning | null;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeletePlanningDialog({
  planning,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeletePlanningDialogProps) {
  const { t } = useTranslation();

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <DialogTitle>{t('selectPlanning.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('selectPlanning.deleteDialog.description', {
              name: planning?.description,
            })}
          </DialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter className="flex flex-col-reverse">
          <DialogClose asChild>
            <Button variant="ghost">{t('global.cta.cancel')}</Button>
          </DialogClose>
          <Button disabled={isPending} variant="destructive" onClick={onConfirm}>
            {isPending && <Spinner />}
            {t('global.cta.delete')}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
