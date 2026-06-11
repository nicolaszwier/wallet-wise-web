import { useOnboarding } from '@/app/hooks/useOnboarding';
import { usePendingFirstTransaction } from '@/app/hooks/usePendingFirstTransaction';
import { usePlanning } from '@/app/hooks/usePlanning';
import { Planning } from '@/app/models/Planning';
import { planningsService } from '@/services/planningsService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const TOTAL_STEPS = 4;

function getDefaultPlanning(plannings: Planning[] | undefined) {
  if (!plannings?.length) return undefined;
  return plannings.find((planning) => planning.isDefault) ?? plannings[0];
}

function getInitialCurrency(planning: Planning | undefined, language: string) {
  if (planning?.currency) return planning.currency;
  if (language.startsWith('pt')) return 'BRL';
  return 'USD';
}

export function useOnboardingController() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const { isCompleted, markCompleted } = useOnboarding();
  const { setPending: setPendingFirstTransaction } = usePendingFirstTransaction();
  const { plannings, setSelectedPlanning } = usePlanning();
  const [step, setStep] = useState(1);
  const [planningName, setPlanningName] = useState('');
  const [currency, setCurrency] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [isFinishing, setIsFinishing] = useState(false);
  const [hasInitializedPlanning, setHasInitializedPlanning] = useState(false);

  const defaultPlanning = useMemo(() => getDefaultPlanning(plannings), [plannings]);

  const { data: currencies, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ['plannings', 'currencies'],
    queryFn: () => planningsService.fetchCurrencies(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isCompleted()) {
      navigate('/', { replace: true });
    }
  }, [isCompleted, navigate]);

  useEffect(() => {
    if (!defaultPlanning || hasInitializedPlanning) return;

    setPlanningName(defaultPlanning.description);
    setCurrency(getInitialCurrency(defaultPlanning, i18n.language));
    setHasInitializedPlanning(true);
  }, [defaultPlanning, hasInitializedPlanning, i18n.language]);

  const goNext = useCallback(() => {
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
    setStep((current) => Math.max(current - 1, 1));
  }, []);

  const skip = useCallback(() => {
    markCompleted();
    navigate('/', { replace: true });
  }, [markCompleted, navigate]);

  const canFinish = !defaultPlanning || planningName.trim().length > 0;

  const finish = useCallback(async () => {
    const trimmedName = planningName.trim();

    if (defaultPlanning && !trimmedName) {
      setNameError('onboarding.step4.nameRequired');
      return;
    }

    setNameError(undefined);
    setIsFinishing(true);

    try {
      if (defaultPlanning) {
        await planningsService.updatePlanning(defaultPlanning.id, {
          description: trimmedName,
          currency: currency || defaultPlanning.currency,
        });

        const updatedPlanning: Planning = {
          ...defaultPlanning,
          description: trimmedName,
          currency: currency || defaultPlanning.currency,
        };

        setSelectedPlanning(updatedPlanning);
        await queryClient.invalidateQueries({ queryKey: ['planning'] });
      }

      markCompleted();
      setPendingFirstTransaction();
      navigate('/', { replace: true });
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('onboarding.step4.error');

      toast.error(message, { position: 'bottom-center' });
    } finally {
      setIsFinishing(false);
    }
  }, [
    currency,
    defaultPlanning,
    markCompleted,
    navigate,
    planningName,
    queryClient,
    setPendingFirstTransaction,
    setSelectedPlanning,
    t,
  ]);

  const handlePlanningNameChange = useCallback((value: string) => {
    setPlanningName(value);
    if (nameError) {
      setNameError(undefined);
    }
  }, [nameError]);

  return {
    step,
    totalSteps: TOTAL_STEPS,
    planningName,
    setPlanningName: handlePlanningNameChange,
    currency,
    setCurrency,
    currencies,
    isLoadingCurrencies,
    nameError,
    isFinishing,
    canFinish,
    goNext,
    goBack,
    skip,
    finish,
  };
}
