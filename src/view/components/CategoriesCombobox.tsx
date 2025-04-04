"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { useTranslation } from "react-i18next"
import { useIsMobile } from "@/app/hooks/useIsMobile"
import { Category } from "@/app/models/Category"
import { ChevronsUpDown } from "lucide-react"
import { CategoryIcon } from "./CategoryIcon"

interface ComponentProps {
  categories: Category[] | undefined
  value?: Category
  onSelect: (category: Category) => void
}

export function CategoriesCombobox({categories, onSelect, value}: ComponentProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const [selected, setSelected] = React.useState<Category | null>(
    value || null
  )
  const { t } = useTranslation()
  
  // Update selected when value changes from external source (like react-hook-form)
  React.useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  const handleSelect = (category: Category| null) => {
    setSelected(category)
    if (category) {
      onSelect(category)
    }
  }

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background-tertiary"
          > 
            <span className="w-full flex items-center gap-3">
              {selected
                ? <>
                    <CategoryIcon
                    size={15} 
                    icon={selected?.icon ?? ''}
                    />
                    {selected?.description}
                  </>
                : t("global.selectCategory")}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          {categories && <List setOpen={setOpen} setSelectedCategory={handleSelect} data={categories} />}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background-tertiary"
        >
          <span className="w-full flex items-center gap-3">
            {selected
              ? <>
                  <CategoryIcon
                  size={15} 
                  icon={selected?.icon ?? ''}
                  />
                  {selected?.description}
                </>
              : t("global.selectCategory")}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4">
          {categories && <List setOpen={setOpen} setSelectedCategory={handleSelect} data={categories} />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function List({
  setOpen,
  setSelectedCategory,
  data
}: {
  setOpen: (open: boolean) => void
  setSelectedCategory: (category: Category | null) => void,
  data: Category[]
}) {
  const { t } = useTranslation()
  return (
    <Command className="bg-background">
      <CommandInput placeholder={t('global.filterCategories')} />
      <CommandList>
        <CommandEmpty>{t('global.noResults')}</CommandEmpty>
        <CommandGroup>
          {data.map((item) => (
            <CommandItem
              key={item.id}
              value={item.description}
              onSelect={(value) => {
                setSelectedCategory(
                  data.find((category) => category.description === value) || null
                )
                setOpen(false)
              }}
            >
              <CategoryIcon
                size={15} 
                icon={item?.icon ?? ''}
              />
              {item.description}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
