import { Category } from '@/app/models/Category';
import { TransactionType } from '@/app/models/TransactionType';
import { isSeedCategory } from '@/app/utils/categories';
import { CategoryIconPicker } from '@/view/components/CategoryIconPicker';
import { CategoryIcon } from '@/view/components/CategoryIcon';
import { Button } from '@/view/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/view/components/ui/dialog';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Spinner } from '@/view/components/ui/spinner';
import { cn } from '@/app/utils/cn';
import { ChevronRight } from 'lucide-react';

export function CategoryEditorDialog({
  open,
  onOpenChange,
  title,
  name,
  onNameChange,
  selectedIcon,
  onIconChange,
  iconOptions,
  onSave,
  isSaving,
  showTypeSelector,
  selectedType,
  onTypeChange,
  parentLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  name: string;
  onNameChange: (value: string) => void;
  selectedIcon: string;
  onIconChange: (value: string) => void;
  iconOptions: { key: string; types: string[] }[];
  onSave: () => void;
  isSaving: boolean;
  showTypeSelector?: boolean;
  selectedType?: TransactionType;
  onTypeChange?: (type: TransactionType) => void;
  parentLabel?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {parentLabel ? (
            <div className="text-sm text-muted-foreground">Parent: {parentLabel}</div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input id="category-name" value={name} onChange={(event) => onNameChange(event.target.value)} />
          </div>
          {showTypeSelector ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={selectedType === TransactionType.EXPENSE ? 'default' : 'outline'}
                onClick={() => onTypeChange?.(TransactionType.EXPENSE)}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={selectedType === TransactionType.INCOME ? 'default' : 'outline'}
                onClick={() => onTypeChange?.(TransactionType.INCOME)}
              >
                Income
              </Button>
            </div>
          ) : null}
          <CategoryIconPicker icons={iconOptions} selectedIcon={selectedIcon} onSelect={onIconChange} />
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={isSaving || !name.trim()} className="w-full sm:w-auto">
            {isSaving ? <Spinner className="size-4" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryRow({
  category,
  isChild = false,
  onEdit,
  onAddSubcategory,
  onArchive,
  onDelete,
}: {
  category: Category;
  isChild?: boolean;
  onEdit: () => void;
  onAddSubcategory?: () => void;
  onArchive: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border bg-background-secondary p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4',
        isChild && 'ml-0',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {isChild ? (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : null}
        <CategoryIcon icon={category.icon} size={18} />
        <div className="min-w-0">
          <div className="truncate font-medium">{category.description}</div>
          {isSeedCategory(category) ? (
            <div className="text-xs text-muted-foreground">Default</div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:shrink-0">
        <Button type="button" size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        {onAddSubcategory ? (
          <Button type="button" size="sm" variant="outline" onClick={onAddSubcategory}>
            Add subcategory
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="outline" onClick={onArchive}>
          Archive
        </Button>
        {onDelete ? (
          <Button type="button" size="sm" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function CategoryTree({
  roots,
  getChildCategories,
  onEdit,
  onAddSubcategory,
  onArchive,
  onDelete,
}: {
  roots: Category[];
  getChildCategories: (parentId: string) => Category[];
  onEdit: (category: Category) => void;
  onAddSubcategory: (parent: Category) => void;
  onArchive: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
}) {
  const activeRoots = roots.filter((category) => category.active);

  if (activeRoots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No categories yet. Create one to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="tree">
      {activeRoots.map((root) => {
        const children = getChildCategories(root.id);

        return (
          <li key={root.id} role="treeitem" aria-expanded={children.length > 0} className="space-y-1">
            <CategoryRow
              category={root}
              onEdit={() => onEdit(root)}
              onAddSubcategory={() => onAddSubcategory(root)}
              onArchive={() => onArchive(root.id)}
            />
            {children.length > 0 ? (
              <ul className="ml-3 space-y-1 border-l border-border pl-3 sm:ml-5 sm:pl-4" role="group">
                {children.map((child) => (
                  <li key={child.id} role="treeitem">
                    <CategoryRow
                      category={child}
                      isChild
                      onEdit={() => onEdit(child)}
                      onArchive={() => onArchive(child.id)}
                      onDelete={() => onDelete(child.id)}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
