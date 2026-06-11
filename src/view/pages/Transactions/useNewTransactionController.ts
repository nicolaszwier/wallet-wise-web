import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserCategories } from "@/app/hooks/useUserCategories";
import { toast } from 'react-hot-toast';
import { transactionsService } from "@/services/transactionsService";
import { CreateTransactionPayload } from "@/app/models/Transaction";
import { usePlanning } from "@/app/hooks/usePlanning";
import { TransactionType } from "@/app/models/TransactionType";
import { useState } from "react";
import { Category } from "@/app/models/Category";
import { getSelectableCategories } from "@/app/utils/categories";
import { RecurrenceFrequency } from "@/app/models/RecurrenceFrequency";
import { useTranslation } from "react-i18next";
import { toCalendarDateString } from "@/app/utils/date";
import { invalidatePeriodsQueries } from "@/app/utils/timelinePersistence";

const schema = z.object({
  amount: z.string()
    .min(1, 'formsValidation.amountRequired')
    .refine((val) => {
      const num = parseFloat(val.replace(',', '.'));
      return !Number.isNaN(num) && num > 0;
    }, { message: 'formsValidation.amountRequired' }),
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
  isRecurring: z.boolean(),
  frequency: z.nativeEnum(RecurrenceFrequency).optional(),
  endDate: z.date().nullable().optional(),
  categoryId: z.string().optional(),
  planningId: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.isRecurring && !data.frequency) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'formsValidation.frequencyRequired',
      path: ['frequency'],
    });
  }
  if (data.isRecurring && data.endDate && data.endDate <= data.date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'formsValidation.endDateAfterStartDate',
      path: ['endDate'],
    });
  }
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  amount: '0',
  description: '',
  date: new Date(),
  category: { id: '', description: '', userId: '', active: false, type: '', icon: '' },
  isPaid: true,
  isRecurring: false,
  frequency: RecurrenceFrequency.MONTHLY,
  endDate: null,
  planningId: '',
};

interface UseNewTransactionControllerOptions {
  onSuccess?: () => void;
}

export function useNewTransactionController(options: UseNewTransactionControllerOptions = {}) {
  const { onSuccess } = options;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { categories } = useUserCategories();
  const { selectedPlanning } = usePlanning();
  const { t } = useTranslation();
  const [transactionType, setTransactionType] = useState(TransactionType.EXPENSE);
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      category: getSelectableCategories(categories, TransactionType.EXPENSE)[0] || defaultValues.category,
    },
  });
  const queryClient = useQueryClient();
  const isRecurring = watch('isRecurring');
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: CreateTransactionPayload) => {
      return transactionsService.create(data);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const payload: CreateTransactionPayload = {
        planningId: selectedPlanning?.id || '',
        categoryId: data.category?.id || '',
        description: data.description,
        type: transactionType,
        date: toCalendarDateString(data.date),
        amount: parseFloat(data.amount.replace(',', '.')),
        isPaid: data.isPaid,
        ...(data.isRecurring && {
          isRecurring: true,
          frequency: data.frequency,
          endDate: data.endDate ? toCalendarDateString(data.endDate) : undefined,
        }),
      };

      await mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: ['planning'] });
      invalidatePeriodsQueries(queryClient, selectedPlanning?.id || '', undefined);
      if (data.isRecurring) {
        queryClient.invalidateQueries({ queryKey: ['recurring-configs', selectedPlanning?.id] });
      }
      toast.success(
        data.isRecurring
          ? t('recurringTransactions.actionsMessages.createSuccess')
          : t('transactions.actionsMessages.createSuccess', { defaultValue: 'Transaction created successfully' }),
        { position: "bottom-center", duration: 6000 },
      );
      onSuccess?.();
      setDrawerOpen(false);
      reset({
        ...defaultValues,
        category: getSelectableCategories(categories, transactionType)[0] || defaultValues.category,
      });
    } catch (err) {
      console.error('Transaction creation error:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || t('transactions.actionsMessages.createError', { defaultValue: 'An error occurred while creating the transaction' }), { position: "bottom-center", duration: 6000 });
    }
  });

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
    setValue('category', getSelectableCategories(categories, type)[0] as Category || defaultValues.category);
  };

  return {
    user,
    categories,
    selectedPlanning,
    handleSubmit,
    register,
    errors,
    isPending,
    control,
    transactionType,
    handleTransactionTypeChange,
    drawerOpen,
    setDrawerOpen,
    isRecurring,
    setValue,
  };
}
