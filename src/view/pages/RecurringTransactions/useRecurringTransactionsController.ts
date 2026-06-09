import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePlanning } from '@/app/hooks/usePlanning';
import { recurringConfigsService } from '@/services/recurringConfigsService';
import { RecurringConfig } from '@/app/models/RecurringConfig';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { invalidatePeriodsQueries } from '@/app/utils/timelinePersistence';

export function useRecurringTransactionsController() {
  const { selectedPlanning } = usePlanning();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeConfig, setActiveConfig] = useState<RecurringConfig | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const planningId = selectedPlanning?.id ?? '';

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['recurring-configs', planningId],
    queryFn: () => recurringConfigsService.fetchByPlanning(planningId),
    enabled: !!planningId,
  });

  const openEditDialog = useCallback((config: RecurringConfig) => {
    setActiveConfig(config);
    setIsEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((config: RecurringConfig) => {
    setActiveConfig(config);
    setIsDeleteDialogOpen(true);
  }, []);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!editId || configs.length === 0) return;

    const config = configs.find((c) => c.id === editId);
    if (config) {
      openEditDialog(config);
      setSearchParams({}, { replace: true });
    }
  }, [configs, searchParams, openEditDialog, setSearchParams]);

  const { mutateAsync: removeConfig, isPending: isPendingDelete } = useMutation({
    mutationFn: (configId: string) => recurringConfigsService.remove(configId),
  });

  const handleDelete = async () => {
    if (!activeConfig) return;

    try {
      await removeConfig(activeConfig.id);
      queryClient.invalidateQueries({ queryKey: ['planning'] });
      invalidatePeriodsQueries(queryClient, planningId);
      queryClient.invalidateQueries({ queryKey: ['recurring-configs', planningId] });
      toast.success(t('recurringTransactions.actionsMessages.deleteSuccess'), { position: 'bottom-center', duration: 6000 });
      setIsDeleteDialogOpen(false);
      setActiveConfig(null);
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((err as any)?.response?.data?.message || t('recurringTransactions.actionsMessages.deleteError'), { position: 'bottom-center', duration: 6000 });
    }
  };

  return {
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
  };
}
