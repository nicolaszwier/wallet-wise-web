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
import { useState } from "react";
import { Category } from "@/app/models/Category";

const schema = z.object({
  amount: z.string()
    // .nonempty('formsValidation.amountRequired')
    // .positive('formsValidation.amountPositive')
    .min(1, 'formsValidation.amountRequired'),
    // .refine((amount) => /[0-9]/.test(amount.toString()), { message: 'formsValidation.amountNumbersOnly' }),
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
  planningId: z.string().optional()
})

type FormData = z.infer<typeof schema>;

export function useNewTransactionController() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const {selectedPlanning} = usePlanning();
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
    defaultValues: {
      amount: '0',
      description: '',
      date: new Date(),
      category: user?.categories?.[0] || {},
      isPaid: true,
      // categoryId: '',
      planningId: ''
    }
  });
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: Transaction) => {
      return transactionsService.create(data);
    },
  });


  const handleSubmit = hookFormSubmit(async (data) => {
    console.log("data", data);
    
    try {
      const payload = {
        ...data,
        planningId: selectedPlanning?.id || '',
        categoryId: data.category?.id || '',
        type: transactionType,
        date: data.date.toISOString(),
        amount: parseFloat(data.amount),
      };
      
      await mutateAsync(payload as Transaction);
      // queryClient.invalidateQueries({queryKey: ['periods', selectedPlanning?.id]});
      queryClient.invalidateQueries({queryKey: ['planning']});
      toast.success('Transaction created successfully', {position: "bottom-center", duration: 6000,})
      setDrawerOpen(false);
      reset();

    } catch (err) {      
      console.error('Transaction creation error:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || 'An error occurred while creating the transaction', {position: "bottom-center", duration: 6000})
    }
  });

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setValue('category', user?.categories?.filter(c => c.type === type)[0] as Category || {});
  };

  return { 
    user, 
    selectedPlanning,
    handleSubmit, 
    register, 
    errors, 
    isPending, 
    control, 
    transactionType, 
    handleTransactionTypeChange,
    drawerOpen,
    setDrawerOpen
  };

}

