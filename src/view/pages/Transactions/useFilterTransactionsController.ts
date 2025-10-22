import { useTransactions } from "@/app/hooks/useTransactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  sortOrder: z.enum(['asc', 'desc']),
})

type FormData = z.infer<typeof schema>;

export function useFilterTransactionsController() {
  const {
    filters,
    isFilterTransactionsDialogOpen, 
    toggleFilterTransactionsDialog,
    setFilters
  } = useTransactions()
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors,  },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: new Date(filters.startDate),
      endDate: new Date(filters.endDate),
      sortOrder: filters.sortOrder
    }
  });

  const handleFilter = hookFormSubmit(async (data) => {
    setFilters({
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      sortOrder: data.sortOrder
    })
    toggleFilterTransactionsDialog(false)
  })

  return { 
    isFilterTransactionsDialogOpen,
    handleFilter,
    toggleFilterTransactionsDialog,
    register,
    handleSubmit: hookFormSubmit,
    errors,
    control, 
  };

}

