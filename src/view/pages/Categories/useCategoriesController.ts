import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { TransactionType } from '@/app/models/TransactionType';
import { useCategoryEditor } from '@/app/hooks/useCategoryEditor';
import { getChildCategories, getRootCategories, isSeedCategory } from '@/app/utils/categories';
import { refreshCategoriesCache } from '@/app/utils/syncCategoriesCache';
import { categoriesService } from '@/services/categoriesService';

export function useCategoriesController() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.EXPENSE);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.list,
    placeholderData: (previousData) => previousData,
  });

  const editor = useCategoryEditor();

  const refreshCategories = () => refreshCategoriesCache(queryClient);

  const archiveMutation = useMutation({
    mutationFn: (categoryId: string) => categoriesService.archive(categoryId),
    onSuccess: refreshCategories,
    onError: () => toast.error('Unable to archive category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => categoriesService.remove(categoryId),
    onSuccess: async () => {
      await refreshCategories();
      toast.success('Category deleted');
    },
    onError: () => toast.error('Unable to delete category'),
  });

  const categories = categoriesQuery.data ?? [];

  const expenseRoots = useMemo(
    () => getRootCategories(categories, TransactionType.EXPENSE),
    [categories],
  );
  const incomeRoots = useMemo(
    () => getRootCategories(categories, TransactionType.INCOME),
    [categories],
  );

  const rootsForActiveTab =
    activeTab === TransactionType.EXPENSE ? expenseRoots : incomeRoots;

  return {
    categoriesQuery,
    activeTab,
    setActiveTab,
    expenseRoots,
    incomeRoots,
    rootsForActiveTab,
    getChildCategories: (parentId: string) => getChildCategories(categories, parentId),
    openCreate: editor.openCreate,
    openEdit: editor.openEdit,
    archiveMutation,
    deleteMutation,
    editorOpen: editor.editorOpen,
    setEditorOpen: editor.setEditorOpen,
    editingCategory: editor.editingCategory,
    parentCategory: editor.parentCategory,
    name: editor.name,
    setName: editor.setName,
    selectedIcon: editor.selectedIcon,
    setSelectedIcon: editor.setSelectedIcon,
    selectedType: editor.selectedType,
    setSelectedType: editor.setSelectedType,
    iconOptions: editor.iconOptions,
    saveCategory: editor.saveCategory,
    isSaving: editor.isSaving,
    isSeedCategory,
  };
}
