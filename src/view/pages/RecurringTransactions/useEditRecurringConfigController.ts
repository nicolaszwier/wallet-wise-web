import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/app/hooks/useAuth';
import { useUserCategories } from '@/app/hooks/useUserCategories';
import { toast } from 'react-hot-toast';
import { recurringConfigsService } from '@/services/recurringConfigsService';
import { RecurringConfig, UpdateRecurringConfigPayload } from '@/app/models/RecurringConfig';
import { usePlanning } from '@/app/hooks/usePlanning';
import { TransactionType } from '@/app/models/TransactionType';
import { RecurrenceFrequency } from '@/app/models/RecurrenceFrequency';
import { Category } from '@/app/models/Category';
import { getSelectableCategories } from '@/app/utils/categories';
import { useTranslation } from 'react-i18next';
import { calendarDateToLocalDate, toCalendarDateString } from '@/app/utils/date';
import { invalidatePeriodsQueries } from '@/app/utils/timelinePersistence';

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
  startDate: z.date(),
  category: z.object({
    id: z.string().min(1, 'formsValidation.categoryRequired'),
    description: z.string(),
    userId: z.string(),
    active: z.boolean(),
    type: z.string(),
    icon: z.string(),
  }, { message: 'formsValidation.categoryRequired' }),
  frequency: z.nativeEnum(RecurrenceFrequency),
  endDate: z.date().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.endDate && data.endDate <= data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'formsValidation.endDateAfterStartDate',
      path: ['endDate'],
    });
  }
});

type FormData = z.infer<typeof schema>;

interface Props {
  activeConfig: RecurringConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export function useEditRecurringConfigController({ activeConfig, isOpen, onClose }: Props) {
  const { user } = useAuth();
  const { categories } = useUserCategories();
  const { selectedPlanning } = usePlanning();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const transactionType = activeConfig?.type ?? TransactionType.EXPENSE;

  const category = categories.find((c) => c.id === activeConfig?.categoryId);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: activeConfig ? {
      amount: Math.abs(activeConfig.amount).toString(),
      description: activeConfig.description,
      startDate: calendarDateToLocalDate(activeConfig.startDate),
      category: category ?? { id: '', description: '', userId: '', active: false, type: '', icon: '' },
      frequency: activeConfig.frequency,
      endDate: activeConfig.endDate ? calendarDateToLocalDate(activeConfig.endDate) : null,
    } : undefined,
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: UpdateRecurringConfigPayload) => {
      if (!activeConfig) throw new Error('No config selected');
      return recurringConfigsService.update(activeConfig.id, payload);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    if (!activeConfig) return;

    try {
      await mutateAsync({
        planningId: selectedPlanning?.id,
        categoryId: data.category.id,
        description: data.description,
        amount: parseFloat(data.amount.replace(',', '.')),
        type: transactionType,
        frequency: data.frequency,
        startDate: toCalendarDateString(data.startDate),
        endDate: data.endDate ? toCalendarDateString(data.endDate) : null,
      });

      queryClient.invalidateQueries({ queryKey: ['planning'] });
      invalidatePeriodsQueries(queryClient, selectedPlanning?.id || '', undefined);
      queryClient.invalidateQueries({ queryKey: ['recurring-configs', selectedPlanning?.id] });
      toast.success(t('recurringTransactions.actionsMessages.updateSuccess'), { position: 'bottom-center', duration: 6000 });
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || t('recurringTransactions.actionsMessages.updateError'), { position: 'bottom-center', duration: 6000 });
    }
  });

  const handleTransactionTypeChange = (type: TransactionType) => {
    setValue('category', getSelectableCategories(categories, type)[0] as Category || { id: '', description: '', userId: '', active: false, type: '', icon: '' });
  };

  return {
    user,
    categories,
    handleSubmit,
    register,
    errors,
    isPending,
    control,
    transactionType,
    handleTransactionTypeChange,
    isOpen,
    setValue,
  };
}
