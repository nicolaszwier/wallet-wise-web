import { useAuth } from '@/app/hooks/useAuth';
import { localStorageKeys } from '@/app/config/localStorageKeys';
import { usersService } from '@/services/usersService';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const DELETE_ACCOUNT_CONFIRMATION_PHRASE = 'DELETE';

export function useDeleteAccountController() {
  const { t } = useTranslation();
  const { signout } = useAuth();
  const [dialogOpen, setDialogOpenState] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => usersService.deleteAccount(),
  });

  const resetConfirmation = useCallback(() => {
    setConfirmationInput('');
  }, []);

  const setDialogOpen: Dispatch<SetStateAction<boolean>> = useCallback((value) => {
    setDialogOpenState((current) => {
      const nextOpen = typeof value === 'function' ? value(current) : value;
      if (!nextOpen) {
        resetConfirmation();
      }
      return nextOpen;
    });
  }, [resetConfirmation]);

  const canConfirm = confirmationInput === DELETE_ACCOUNT_CONFIRMATION_PHRASE;

  const handleDelete = async () => {
    if (!canConfirm) return;

    try {
      await mutateAsync();
      localStorage.removeItem(localStorageKeys.ONBOARDING_COMPLETED);
      localStorage.removeItem(localStorageKeys.PENDING_FIRST_TRANSACTION);
      signout();
      toast.success(t('deleteAccount.success'), { position: 'bottom-center' });
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('deleteAccount.error');

      toast.error(message, { position: 'bottom-center' });
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    confirmationInput,
    setConfirmationInput,
    canConfirm,
    handleDelete,
    isPending,
  };
}
