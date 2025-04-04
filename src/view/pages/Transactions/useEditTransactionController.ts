import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from 'react-hot-toast';
import { transactionsService } from "@/services/transactionsService";
import { Transaction } from "@/app/models/Transaction";
import { usePlanning } from "@/app/hooks/usePlanning";
import { TransactionType } from "@/app/models/TransactionType";
import { useEffect, useState } from "react";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useTranslation } from "react-i18next";

const schema = z.object({
  amount: z.string()
    .min(1, 'formsValidation.amountRequired'),
  description: z.string()
    .min(1, 'formsValidation.descriptionRequired')
    .max(100, 'formsValidation.descriptionLength'),
  date: z.date(),
  category: z.object({
    id: z.string()
      .min(1, 'formsValidation.categoryRequired'),
    description: z.string(),
    userId: z.string(),
    active: z.boolean(),
    type: z.string(),
    icon: z.string(),
  }, { message: 'formsValidation.categoryRequired' }),
  isPaid: z.boolean(),
  categoryId: z.string().optional(),
  planningId: z.string().optional(),
  periodId: z.string().optional(),
  id: z.string().optional(),
})

type FormData = z.infer<typeof schema>;

export function useEditTransactionController() {
  const { user } = useAuth();
  const { t } = useTranslation( )
  const {selectedPlanning} = usePlanning();
  const {
    activeTransaction, 
    isEditTransactionDialogOpen, 
    toggleEditTransactionDialog
  } = useTransactions()
  const [transactionType, setTransactionType] = useState(TransactionType.EXPENSE)
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors,  },
    control,
    setValue, 
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      amount: Math.abs(activeTransaction?.amount ?? 0).toString(),
      description: activeTransaction?.description ?? "",
      date: activeTransaction ? new Date(activeTransaction.date) : new Date(),
      category: activeTransaction?.category || { id: '', description: '', userId: '', active: false, type: '', icon: '' },
      isPaid: activeTransaction?.isPaid ?? false,
      // categoryId: '',
      planningId: activeTransaction?.planningId,
      periodId: activeTransaction?.periodId,
      id: activeTransaction?.id,
    }
  });
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: Transaction) => {
      return transactionsService.update(data);
    },
  });

  useEffect(()=> {
    setTransactionType(activeTransaction?.type as TransactionType);
  }, [activeTransaction, activeTransaction?.type, setValue, user?.categories])


  const handleSubmit = hookFormSubmit(async (data) => {
    console.log("data", data);
    
    try {
      const payload = {
        ...data,
        categoryId: data.category?.id || '',
        date: data.date.toISOString(),
        amount: parseFloat(data.amount),
        type: activeTransaction?.type
      };
      
      await mutateAsync(payload as Transaction);
      queryClient.invalidateQueries({queryKey: ['planning']});
      toggleEditTransactionDialog(false)
      toast.success(t('transactions.actionsMessages.updateSuccess'), {position: "bottom-center", duration: 6000,})
      reset();

    } catch (err) {      
      console.error('Transaction update error:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || t('transactions.actionsMessages.updateError'), {position: "bottom-center", duration: 6000})
    }
  });

  return { 
    user, 
    selectedPlanning,
    errors, 
    isPending, 
    control, 
    transactionType, 
    isEditTransactionDialogOpen,
    toggleEditTransactionDialog,
    handleSubmit, 
    register, 
  };

}

