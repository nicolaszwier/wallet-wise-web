"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./ui/command"
import { useTranslation } from "react-i18next"
import { useIsMobile } from "@/app/hooks/useIsMobile"
import { Category } from "@/app/models/Category"
import { TransactionType } from "@/app/models/TransactionType"
import { ChevronsUpDown, Plus } from "lucide-react"
import { CategoryIcon } from "./CategoryIcon"
import { getCategoryLabel, getRootCategories } from "@/app/utils/categories"
import { useCategoryEditor } from "@/app/hooks/useCategoryEditor"
import { CategoryEditorDialog } from "@/view/pages/Categories/CategoryManagementComponents"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface ComponentProps {
  categories: Category[] | undefined
  allCategories?: Category[] | undefined
  value?: Category
  onSelect: (category: Category) => void
  transactionType: TransactionType
  allowCreate?: boolean
}

export function CategoriesCombobox({
  categories,
  allCategories,
  onSelect,
  value,
  transactionType,
  allowCreate = true,
}: ComponentProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const isMobile = useIsMobile()
  const [selected, setSelected] = React.useState<Category | null>(value || null)
  const { t } = useTranslation()
  const lookup = allCategories ?? categories ?? []
  const rootCategories = React.useMemo(
    () => getRootCategories(lookup, transactionType),
    [lookup, transactionType],
  )

  const editor = useCategoryEditor({
    onCreated: (category) => {
      setSelected(category)
      onSelect(category)
    },
  })

  React.useEffect(() => {
    if (value) {
      setSelected(value)
    }
  }, [value])

  React.useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  const filteredCategories = React.useMemo(() => {
    const items = categories ?? []
    const query = search.trim().toLowerCase()
    if (!query) {
      return items
    }

    return items.filter((item) => {
      const label = getCategoryLabel(item, lookup).toLowerCase()
      return label.includes(query) || item.description.toLowerCase().includes(query)
    })
  }, [categories, lookup, search])

  const handleSelect = (category: Category | null) => {
    setSelected(category)
    if (category) {
      onSelect(category)
    }
    setOpen(false)
  }

  const selectedLabel = selected ? getCategoryLabel(selected, lookup) : t("global.selectCategory")

  const trigger = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-full justify-between bg-background-tertiary"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {selected ? (
          <>
            <CategoryIcon size={15} icon={selected.icon ?? ''} />
            <span className="truncate">{selectedLabel}</span>
          </>
        ) : (
          <span className="truncate">{t("global.selectCategory")}</span>
        )}
      </span>
      <ChevronsUpDown className="ml-2 shrink-0 opacity-50" />
    </Button>
  )

  const list = (
    <List
      data={filteredCategories}
      lookup={lookup}
      onSelect={handleSelect}
      search={search}
      onSearchChange={setSearch}
    />
  )

  const picker = isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="flex max-h-[75vh] flex-col overflow-hidden px-2 pb-6 pt-2">
          {list}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[min(400px,calc(100vw-2rem))] p-0"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {list}
      </PopoverContent>
    </Popover>
  )

  return (
    <>
      <div className="flex w-full items-stretch gap-2">
        <div className="min-w-0 flex-1">{picker}</div>
        {allowCreate ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 bg-background-tertiary"
                aria-label={t('categories.newCategory')}
              >
                <Plus className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => editor.openCreate(transactionType)}>
                {t('categories.newCategory')}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={rootCategories.length === 0}>
                  {t('categories.newSubcategory')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
                  {rootCategories.map((root) => (
                    <DropdownMenuItem
                      key={root.id}
                      onClick={() => editor.openCreate(transactionType, root)}
                    >
                      {getCategoryLabel(root, lookup)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <CategoryEditorDialog
        open={editor.editorOpen}
        onOpenChange={editor.setEditorOpen}
        title={
          editor.parentCategory
            ? t('categories.newSubcategory')
            : t('categories.newCategory')
        }
        name={editor.name}
        onNameChange={editor.setName}
        selectedIcon={editor.selectedIcon}
        onIconChange={editor.setSelectedIcon}
        iconOptions={editor.iconOptions}
        onSave={editor.saveCategory}
        isSaving={editor.isSaving}
        showTypeSelector={false}
        selectedType={editor.selectedType}
        parentLabel={editor.parentCategory?.description ?? null}
      />
    </>
  )
}

function List({
  data,
  lookup,
  onSelect,
  search,
  onSearchChange,
}: {
  data: Category[]
  lookup: Category[]
  onSelect: (category: Category) => void
  search: string
  onSearchChange: (value: string) => void
}) {
  const { t } = useTranslation()

  return (
    <Command
      shouldFilter={false}
      className="bg-background flex max-h-[min(400px,80vh)] flex-col overflow-hidden rounded-md"
    >
      <CommandInput
        placeholder={t('global.filterCategories')}
        value={search}
        onValueChange={onSearchChange}
      />
      <CommandList
        className="max-h-[min(320px,calc(80vh-3.5rem))] overflow-y-auto overscroll-contain"
        onWheel={(event) => event.stopPropagation()}
      >
        <CommandEmpty>{t('global.noResults')}</CommandEmpty>
        {data.map((item) => {
          const label = getCategoryLabel(item, lookup)
          return (
            <CommandItem
              key={item.id}
              value={item.id}
              onSelect={() => onSelect(item)}
            >
              <CategoryIcon size={15} icon={item.icon ?? ''} />
              <span className={item.parentCategoryId ? 'pl-2 text-muted-foreground' : undefined}>
                {label}
              </span>
            </CommandItem>
          )
        })}
      </CommandList>
    </Command>
  )
}
