import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/hooks/useAuth';
import { usePlanning } from '@/app/hooks/usePlanning';
import { Category } from '@/app/models/Category';
import { TransactionType } from '@/app/models/TransactionType';
import { transactionsService } from '@/services/transactionsService';
import { planningsService } from '@/services/planningsService';

const schema = z.object({
  description: z.string().min(1, 'formsValidation.descriptionRequired'),
  amount: z.number().positive('formsValidation.amountRequired'),
  date: z.date(),
  category: z.object({
    id: z.string().min(1, 'formsValidation.categoryRequired'),
    description: z.string(),
    userId: z.string(),
    active: z.boolean(),
    type: z.string(),
    icon: z.string(),
  }, { message: 'formsValidation.categoryRequired' }),
  planningId: z.string().min(1, 'expenseSplitter.export.planningRequired'),
  isPaid: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export interface ExportItem {
  id: string;
  description: string;
  amount: number;
  kind: 'expense' | 'settlement';
}

interface UseExportExpensesControllerProps {
  onExpenseExported: (expenseId: string) => void;
  onSettlementExported: (settlementKey: string) => void;
}

export function useExportExpensesController({
  onExpenseExported,
  onSettlementExported,
}: UseExportExpensesControllerProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { selectedPlanning } = usePlanning();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [itemsToExport, setItemsToExport] = useState<ExportItem[]>([]);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);

  const { data: plannings } = useQuery({
    queryKey: ['plannings'],
    queryFn: () => planningsService.fetchPlannings(),
    enabled: open && !selectedPlanning,
  });

  const categories =
    user?.categories?.filter((c) => c.type === transactionType) ?? [];

  const {
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      amount: 0,
      date: new Date(),
      category: categories[0] as Category,
      planningId: selectedPlanning?.id ?? '',
      isPaid: true,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: FormData & ExportItem) =>
      transactionsService.create({
        id: '',
        planningId: payload.planningId,
        categoryId: payload.category.id,
        description: payload.description,
        amount: payload.amount,
        date: payload.date.toISOString(),
        isPaid: payload.isPaid,
        type: transactionType,
      }),
  });

  const openExport = useCallback(
    (items: ExportItem[], type: TransactionType) => {
      if (items.length === 0) return;

      const typeCategories =
        user?.categories?.filter((c) => c.type === type) ?? [];

      setTransactionType(type);
      setItemsToExport(items);

      if (items.length === 1) {
        reset({
          description: items[0].description,
          amount: items[0].amount,
          date: new Date(),
          category: typeCategories[0] as Category,
          planningId: selectedPlanning?.id ?? '',
          isPaid: true,
        });
      } else {
        reset({
          description: '',
          amount: 0,
          date: new Date(),
          category: typeCategories[0] as Category,
          planningId: selectedPlanning?.id ?? '',
          isPaid: true,
        });
      }

      setOpen(true);
    },
    [reset, user?.categories, selectedPlanning?.id],
  );

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      if (itemsToExport.length === 1) {
        const item = itemsToExport[0];
        await mutateAsync({ ...data, ...item });
        if (item.kind === 'expense') onExpenseExported(item.id);
        else onSettlementExported(item.id);
        toast.success(t('expenseSplitter.export.success'), { position: 'bottom-center' });
      } else {
        for (const item of itemsToExport) {
          await mutateAsync({
            ...data,
            ...item,
            description: item.description,
            amount: item.amount,
          });
          if (item.kind === 'expense') onExpenseExported(item.id);
          else onSettlementExported(item.id);
        }
        toast.success(t('expenseSplitter.export.successAll', { count: itemsToExport.length }), {
          position: 'bottom-center',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['planning'] });
      setOpen(false);
      setItemsToExport([]);
    } catch {
      toast.error(t('expenseSplitter.export.error'), { position: 'bottom-center' });
    }
  });

  return {
    open,
    setOpen,
    itemsToExport,
    transactionType,
    openExport,
    handleSubmit,
    control,
    errors,
    isPending,
    categories,
    plannings: plannings ?? [],
    selectedPlanning,
  };
}
