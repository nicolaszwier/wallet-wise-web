import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/app/models/Category';
import { TransactionType } from '@/app/models/TransactionType';
import { isSeedCategory } from '@/app/utils/categories';
import { categoriesService } from '@/services/categoriesService';
import { refreshCategoriesCache } from '@/app/utils/syncCategoriesCache';

interface UseCategoryEditorOptions {
  onCreated?: (category: Category) => void;
}

export function useCategoryEditor(options: UseCategoryEditorOptions = {}) {
  const queryClient = useQueryClient();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('ellipsis.circle.fill');
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.EXPENSE);

  const iconOptionsQuery = useQuery({
    queryKey: ['categories', 'icon-options', selectedType],
    queryFn: () => categoriesService.iconOptions(selectedType),
    enabled: editorOpen,
  });

  const refreshCategories = () => refreshCategoriesCache(queryClient);

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesService.create(payload),
    onSuccess: async (created) => {
      await refreshCategories();
      toast.success('Category created');
      setEditorOpen(false);
      if (created) {
        options.onCreated?.(created);
      }
    },
    onError: () => toast.error('Unable to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      categoriesService.update(id, payload),
    onSuccess: async () => {
      await refreshCategories();
      toast.success('Category updated');
      setEditorOpen(false);
    },
    onError: () => toast.error('Unable to update category'),
  });

  const openCreate = (type: TransactionType, parent: Category | null = null) => {
    setEditingCategory(null);
    setParentCategory(parent);
    setSelectedType(parent?.type ?? type);
    setName('');
    setSelectedIcon('ellipsis.circle.fill');
    setEditorOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setParentCategory(null);
    setSelectedType(category.type);
    setName(category.description);
    setSelectedIcon(category.icon);
    setEditorOpen(true);
  };

  const saveCategory = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    if (editingCategory) {
      const payload: UpdateCategoryPayload = isSeedCategory(editingCategory)
        ? { customLabel: trimmedName, icon: selectedIcon }
        : { description: trimmedName, icon: selectedIcon };
      updateMutation.mutate({ id: editingCategory.id, payload });
      return;
    }

    createMutation.mutate({
      description: trimmedName,
      icon: selectedIcon,
      type: parentCategory?.type ?? selectedType,
      parentCategoryId: parentCategory?.id ?? null,
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return {
    editorOpen,
    setEditorOpen,
    editingCategory,
    parentCategory,
    name,
    setName,
    selectedIcon,
    setSelectedIcon,
    selectedType,
    setSelectedType,
    iconOptions: iconOptionsQuery.data ?? [],
    saveCategory,
    isSaving,
    openCreate,
    openEdit,
  };
}
