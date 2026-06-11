import { localStorageKeys } from '@/app/config/localStorageKeys';
import { usePlanning } from '@/app/hooks/usePlanning';
import { Planning } from '@/app/models/Planning';
import { planningsService } from '@/services/planningsService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  canDeletePlanning,
  getInitialPlanningCurrency,
  resolveNextSelectedPlanning,
} from './planningManagementUtils';

export function useSelectPlanningController() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { plannings, selectedPlanning, setSelectedPlanning } = usePlanning();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activePlanning, setActivePlanning] = useState<Planning | null>(null);

  const [createName, setCreateName] = useState('');
  const [createCurrency, setCreateCurrency] = useState(() =>
    getInitialPlanningCurrency(i18n.language),
  );
  const [createNameError, setCreateNameError] = useState<string | undefined>();

  const [editName, setEditName] = useState('');
  const [editNameError, setEditNameError] = useState<string | undefined>();

  const { data: currencies, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ['plannings', 'currencies'],
    queryFn: () => planningsService.fetchCurrencies(),
    staleTime: Infinity,
  });

  const invalidatePlannings = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['planning'] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (params: { description: string; currency: string }) =>
      planningsService.createPlanning(params),
    onSuccess: async (created) => {
      await invalidatePlannings();
      setSelectedPlanning(created);
      setCreateOpen(false);
      setCreateName('');
      setCreateCurrency(getInitialPlanningCurrency(i18n.language));
      toast.success(t('selectPlanning.toasts.created'), { position: 'bottom-center' });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('selectPlanning.toasts.createError');
      toast.error(message, { position: 'bottom-center' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; description: string; currency: string }) =>
      planningsService.updatePlanning(params.id, {
        description: params.description,
        currency: params.currency,
      }),
    onSuccess: async (_data, variables) => {
      await invalidatePlannings();

      if (selectedPlanning?.id === variables.id) {
        setSelectedPlanning({
          ...selectedPlanning,
          description: variables.description,
        });
      }

      setEditOpen(false);
      setActivePlanning(null);
      toast.success(t('selectPlanning.toasts.updated'), { position: 'bottom-center' });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('selectPlanning.toasts.updateError');
      toast.error(message, { position: 'bottom-center' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (planningId: string) => planningsService.deletePlanning(planningId),
    onSuccess: async (_data, deletedId) => {
      const currentPlannings = plannings ?? [];
      const wasSelected = selectedPlanning?.id === deletedId;
      const nextPlanning = resolveNextSelectedPlanning(currentPlannings, deletedId);

      await invalidatePlannings();

      if (wasSelected) {
        if (nextPlanning) {
          setSelectedPlanning(nextPlanning);
        } else {
          localStorage.removeItem(localStorageKeys.SELECTED_PLANNING);
        }
      }

      setDeleteOpen(false);
      setActivePlanning(null);
      toast.success(t('selectPlanning.toasts.deleted'), { position: 'bottom-center' });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('selectPlanning.toasts.deleteError');
      toast.error(message, { position: 'bottom-center' });
    },
  });

  const openCreate = useCallback(() => {
    setCreateName('');
    setCreateCurrency(getInitialPlanningCurrency(i18n.language));
    setCreateNameError(undefined);
    setCreateOpen(true);
  }, [i18n.language]);

  const openEdit = useCallback((planning: Planning) => {
    setActivePlanning(planning);
    setEditName(planning.description);
    setEditNameError(undefined);
    setEditOpen(true);
  }, []);

  const openDelete = useCallback((planning: Planning) => {
    setActivePlanning(planning);
    setDeleteOpen(true);
  }, []);

  const handleSelect = useCallback(
    (planning: Planning) => {
      setSelectedPlanning(planning);
      navigate('/');
    },
    [navigate, setSelectedPlanning],
  );

  const handleCreate = useCallback(() => {
    const trimmedName = createName.trim();

    if (!trimmedName) {
      setCreateNameError('selectPlanning.validation.nameRequired');
      return;
    }

    if (!createCurrency) {
      toast.error(t('selectPlanning.validation.currencyRequired'), { position: 'bottom-center' });
      return;
    }

    setCreateNameError(undefined);
    createMutation.mutate({ description: trimmedName, currency: createCurrency });
  }, [createCurrency, createMutation, createName, t]);

  const handleEdit = useCallback(() => {
    if (!activePlanning) return;

    const trimmedName = editName.trim();

    if (!trimmedName) {
      setEditNameError('selectPlanning.validation.nameRequired');
      return;
    }

    setEditNameError(undefined);
    updateMutation.mutate({
      id: activePlanning.id,
      description: trimmedName,
      currency: activePlanning.currency,
    });
  }, [activePlanning, editName, updateMutation]);

  const handleDelete = useCallback(() => {
    if (!activePlanning) return;
    deleteMutation.mutate(activePlanning.id);
  }, [activePlanning, deleteMutation]);

  const handleCreateNameChange = useCallback((value: string) => {
    setCreateName(value);
    if (createNameError) {
      setCreateNameError(undefined);
    }
  }, [createNameError]);

  const handleEditNameChange = useCallback((value: string) => {
    setEditName(value);
    if (editNameError) {
      setEditNameError(undefined);
    }
  }, [editNameError]);

  const canDelete = useCallback(
    (planning: Planning) => canDeletePlanning(plannings ?? [], planning),
    [plannings],
  );

  return {
    plannings: plannings ?? [],
    selectedPlanning,
    currencies,
    isLoadingCurrencies,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    activePlanning,
    createName,
    setCreateName: handleCreateNameChange,
    createCurrency,
    setCreateCurrency,
    createNameError,
    editName,
    setEditName: handleEditNameChange,
    editNameError,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreate,
    openEdit,
    openDelete,
    handleSelect,
    handleCreate,
    handleEdit,
    handleDelete,
    canDelete,
  };
}
