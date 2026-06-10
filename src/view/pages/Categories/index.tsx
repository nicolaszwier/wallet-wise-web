import { TransactionType } from '@/app/models/TransactionType';
import { CategoryEditorDialog, CategoryTree } from './CategoryManagementComponents';
import { useCategoriesController } from './useCategoriesController';
import { Button } from '@/view/components/ui/button';
import { Spinner } from '@/view/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/view/components/ui/tabs';
import { useTranslation } from 'react-i18next';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const controller = useCategoriesController();

  if (controller.categoriesQuery.isPending && !controller.categoriesQuery.data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="mx-auto flex w-full max-w-2xl flex-col p-2 sm:p-4">
        <div className="mb-4 flex flex-col gap-3 px-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold sm:text-2xl">{t('categories.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('categories.description')}</p>
          </div>
          <Button
            type="button"
            className="w-full shrink-0 sm:w-auto"
            onClick={() => controller.openCreate(controller.activeTab)}
          >
            {t('categories.newCategory')}
          </Button>
        </div>

        <Tabs
          value={controller.activeTab}
          onValueChange={(value) => controller.setActiveTab(value as TransactionType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={TransactionType.EXPENSE}>{t('global.expenses')}</TabsTrigger>
            <TabsTrigger value={TransactionType.INCOME}>{t('global.income')}</TabsTrigger>
          </TabsList>

          <TabsContent value={TransactionType.EXPENSE} className="mt-4 px-1 sm:px-2">
            <CategoryTree
              roots={controller.expenseRoots}
              getChildCategories={controller.getChildCategories}
              onEdit={controller.openEdit}
              onAddSubcategory={(parent) => controller.openCreate(TransactionType.EXPENSE, parent)}
              onArchive={(id) => controller.archiveMutation.mutate(id)}
              onDelete={(id) => controller.deleteMutation.mutate(id)}
            />
          </TabsContent>

          <TabsContent value={TransactionType.INCOME} className="mt-4 px-1 sm:px-2">
            <CategoryTree
              roots={controller.incomeRoots}
              getChildCategories={controller.getChildCategories}
              onEdit={controller.openEdit}
              onAddSubcategory={(parent) => controller.openCreate(TransactionType.INCOME, parent)}
              onArchive={(id) => controller.archiveMutation.mutate(id)}
              onDelete={(id) => controller.deleteMutation.mutate(id)}
            />
          </TabsContent>
        </Tabs>

        <CategoryEditorDialog
          open={controller.editorOpen}
          onOpenChange={controller.setEditorOpen}
          title={controller.editingCategory ? t('categories.editCategory') : t('categories.newCategory')}
          name={controller.name}
          onNameChange={controller.setName}
          selectedIcon={controller.selectedIcon}
          onIconChange={controller.setSelectedIcon}
          iconOptions={controller.iconOptions}
          onSave={controller.saveCategory}
          isSaving={controller.isSaving}
          showTypeSelector={!controller.editingCategory && !controller.parentCategory}
          selectedType={controller.selectedType}
          onTypeChange={controller.setSelectedType}
          parentLabel={controller.parentCategory?.description ?? null}
        />
      </div>
    </div>
  );
}
