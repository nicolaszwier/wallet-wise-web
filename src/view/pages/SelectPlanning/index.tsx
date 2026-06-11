import { Button } from '@/view/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/view/components/ui/popover';
import { CircleHelp, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CreatePlanningDialog } from './components/CreatePlanningDialog';
import { DeletePlanningDialog } from './components/DeletePlanningDialog';
import { EditPlanningDialog } from './components/EditPlanningDialog';
import { PlanningListItem } from './components/PlanningListItem';
import { useSelectPlanningController } from './useSelectPlanningController';
import { useEffect } from 'react';
import { analytics } from '@/app/analytics/track';

export default function SelectPlanning() {
  const { t } = useTranslation();
  const controller = useSelectPlanningController();

  useEffect(() => {
    if (controller.plannings.length === 0) {
      analytics.emptyStateViewed('select_planning', 'no_plannings');
    }
  }, [controller.plannings.length]);

  return (
    <div className="flex h-full w-full justify-center px-4 py-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-28">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold sm:text-2xl">{t('selectPlanning.title')}</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0">
                    <CircleHelp className="size-4" />
                    <span className="sr-only">{t('selectPlanning.helpText')}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-sm text-sm text-muted-foreground">
                  {t('selectPlanning.helpText')}
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-sm text-muted-foreground">{t('selectPlanning.description')}</p>
          </div>
          <Button
            type="button"
            className="w-full shrink-0 sm:w-auto"
            onClick={controller.openCreate}
          >
            <Plus className="size-4" />
            {t('selectPlanning.newPlanning')}
          </Button>
        </div>

        {controller.plannings.length === 0 && (
          <div className="rounded-md border border-dashed border-border-light p-8 text-center text-sm text-muted-foreground">
            {t('selectPlanning.emptyState')}
          </div>
        )}

        {controller.plannings.length > 0 && (
          <div className="flex flex-col gap-2">
            {controller.plannings.map((planning) => (
              <PlanningListItem
                key={planning.id}
                planning={planning}
                isSelected={controller.selectedPlanning?.id === planning.id}
                canDelete={controller.canDelete(planning)}
                onSelect={controller.handleSelect}
                onEdit={controller.openEdit}
                onDelete={controller.openDelete}
              />
            ))}
          </div>
        )}

        <CreatePlanningDialog
          open={controller.createOpen}
          onOpenChange={controller.setCreateOpen}
          name={controller.createName}
          onNameChange={controller.setCreateName}
          currency={controller.createCurrency}
          onCurrencyChange={controller.setCreateCurrency}
          currencies={controller.currencies}
          isLoadingCurrencies={controller.isLoadingCurrencies}
          nameError={controller.createNameError}
          onSubmit={controller.handleCreate}
          isPending={controller.isCreating}
        />

        <EditPlanningDialog
          planning={controller.activePlanning}
          open={controller.editOpen}
          onOpenChange={controller.setEditOpen}
          name={controller.editName}
          onNameChange={controller.setEditName}
          nameError={controller.editNameError}
          onSubmit={controller.handleEdit}
          isPending={controller.isUpdating}
        />

        <DeletePlanningDialog
          planning={controller.activePlanning}
          open={controller.deleteOpen}
          onOpenChange={controller.setDeleteOpen}
          onConfirm={controller.handleDelete}
          isPending={controller.isDeleting}
        />
      </div>
    </div>
  );
}
