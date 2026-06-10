import { Category } from '@/app/models/Category';
import { TransactionType } from '@/app/models/TransactionType';

export function getActiveCategories(categories: Category[] | undefined, type: TransactionType) {
  return (categories ?? []).filter((category) => category.active !== false && category.type === type);
}

export function getSelectableCategories(categories: Category[] | undefined, type: TransactionType) {
  return getActiveCategories(categories, type);
}

export function getGroupedCategoriesForPicker(categories: Category[] | undefined, type: TransactionType) {
  const activeCategories = getSelectableCategories(categories, type);
  const roots = activeCategories.filter((category) => !category.parentCategoryId);
  const grouped: Category[] = [];
  const included = new Set<string>();

  for (const root of roots) {
    grouped.push(root);
    included.add(root.id);

    for (const child of activeCategories.filter((category) => category.parentCategoryId === root.id)) {
      grouped.push(child);
      included.add(child.id);
    }
  }

  for (const category of activeCategories) {
    if (!included.has(category.id)) {
      grouped.push(category);
    }
  }

  return grouped;
}

export function getRootCategories(categories: Category[] | undefined, type: TransactionType) {
  return getActiveCategories(categories, type).filter((category) => !category.parentCategoryId);
}

export function getChildCategories(categories: Category[] | undefined, parentId: string) {
  return (categories ?? []).filter(
    (category) => category.parentCategoryId === parentId && category.active !== false,
  );
}

export function getCategoryLabel(category: Category, categories: Category[]) {
  if (!category.parentCategoryId) {
    return category.description;
  }

  const parent = categories.find((item) => item.id === category.parentCategoryId);
  return parent ? `${parent.description} · ${category.description}` : category.description;
}

export function isSeedCategory(category: Category) {
  return category.source === 'SEED';
}
