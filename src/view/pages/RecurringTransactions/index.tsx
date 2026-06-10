import { useUserCategories } from '@/app/hooks/useUserCategories';
import { Skeleton } from '@/view/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useRecurringTransactionsController } from './useRecurringTransactionsController';
import { RecurringConfigListItem } from './components/RecurringConfigListItem';
import { EditRecurringConfigDialog } from './components/EditRecurringConfigDialog';
import { DeleteRecurringConfigDialog } from './components/DeleteRecurringConfigDialog';

export default function RecurringTransactions() {
  const { t } = useTranslation();
  const { categories } = useUserCategories();
  const {
    configs,
    isLoading,
    selectedPlanning,
    activeConfig,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openEditDialog,
    openDeleteDialog,
    handleDelete,
    isPendingDelete,
    setActiveConfig,
  } = useRecurringTransactionsController();

  return (
    <div className="h-full p-2 md:p-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-8">
        <h1 className="text-2xl font-bold">{t('recurringTransactions.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('recurringTransactions.description')}</p>

        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {!isLoading && configs.length === 0 && (
          <div className="rounded-md border border-dashed border-border-light p-8 text-center text-sm text-muted-foreground">
            {t('recurringTransactions.emptyState')}
          </div>
        )}

        {!isLoading && configs.length > 0 && (
          <div className="flex flex-col gap-2">
            {configs.map((config) => (
              <RecurringConfigListItem
                key={config.id}
                config={config}
                category={categories.find((c) => c.id === config.categoryId)}
                currency={selectedPlanning?.currency ?? 'BRL'}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}
      </div>

      <EditRecurringConfigDialog
        activeConfig={activeConfig}
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          const next = typeof open === 'function' ? open(isEditDialogOpen) : open;
          setIsEditDialogOpen(next);
          if (!next) setActiveConfig(null);
        }}
      />

      <DeleteRecurringConfigDialog
        config={activeConfig}
        currency={selectedPlanning?.currency ?? 'BRL'}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isPending={isPendingDelete}
      />
    </div>
  );
}
