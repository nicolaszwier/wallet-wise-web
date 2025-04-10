"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/view/components/ui/dropdown-menu"
import { Button } from "@/view/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ViewType } from "@/app/models/ViewType"
import { useApp } from "@/app/hooks/useApp"

export function ViewTypeSelectorDropdown() {
  const { preferredView, changePreferredView } = useApp()
  const { t } = useTranslation()
  const [selected, setSelected] = useState(preferredView.toString())

  const handleChangeSelected = (value: string) => {
    setSelected(value)
    changePreferredView(value as ViewType)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="xs" variant="ghost">
            <LayoutGrid />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t('transactions.viewTypeSelector.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selected} onValueChange={handleChangeSelected}>
          <DropdownMenuRadioItem value={ViewType.COLUMNS.toString()}>{t('transactions.viewTypeSelector.options.columns')}</DropdownMenuRadioItem>
          {/* <DropdownMenuRadioItem value={ViewType.RESIZABLE.toString()}>{t('transactions.viewTypeSelector.options.resizable')}</DropdownMenuRadioItem> */}
          <DropdownMenuRadioItem value={ViewType.TIMELINE.toString()}>{t('transactions.viewTypeSelector.options.timeline')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
