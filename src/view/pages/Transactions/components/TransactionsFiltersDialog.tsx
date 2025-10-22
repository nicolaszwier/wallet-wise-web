"use client"

import { Button } from "@/view/components/ui/button"
import { useTranslation } from "react-i18next"
import { DrawerClose, DrawerTitle } from "@/view/components/ui/drawer"
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from "@/view/components/ResponsiveDialog"
import { Label } from "@/view/components/ui/label"
import { Controller } from "react-hook-form"
import { cn } from "@/app/utils/cn"
import { Popover, PopoverContent } from "@/view/components/ui/popover"
import { PopoverTrigger } from "@/view/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { formatDate } from "@/app/utils/date"
import { Calendar } from "@/view/components/ui/calendar"
import { useFilterTransactionsController } from "../useFilterTransactionsController"

export function TransactionsFiltersDialog() {
  const { t, i18n } = useTranslation()
  const { 
    isFilterTransactionsDialogOpen,
    toggleFilterTransactionsDialog,
    handleFilter,
    control,
    errors , 
  } = useFilterTransactionsController()

  return (
    <ResponsiveDialog open={isFilterTransactionsDialogOpen} onOpenChange={toggleFilterTransactionsDialog}>
      <ResponsiveDialogContent className="flex justify-center" aria-describedby="sfsdf">
        <form className="w-full" onSubmit={handleFilter}>
          <div className="flex flex-col max-w-[800px] justify-center m-auto w-full">
            <ResponsiveDialogHeader>
                <DrawerTitle>{t('transactions.filterDialog.title')}</DrawerTitle>
            </ResponsiveDialogHeader>
            <div className="p-4 mt-6 mb-4 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">{t('transactions.filterDialog.startDate')}</Label>
                <Controller
                  control={control}
                  name="startDate"
                  // defaultValue={true}
                  render={({ field: { onChange, value } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background-tertiary",
                          !value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {formatDate(value, i18n.language)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                />
                <span className="inline-block text-sm text-destructive">
                  {t(errors.startDate?.message as string)}
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">{t('transactions.filterDialog.endDate')}</Label>
                <Controller
                  control={control}
                  name="endDate"
                  // defaultValue={true}
                  render={({ field: { onChange, value } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background-tertiary",
                          !value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {formatDate(value, i18n.language)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                />
                <span className="inline-block text-sm text-destructive">
                  {t(errors.endDate?.message as string)}
                </span>
              </div>
            </div>
            <ResponsiveDialogFooter className="sm:flex flex-col-reverse px-4">
              <DrawerClose asChild>
                <Button variant="ghost">
                  {t('global.cta.cancel')}
                </Button>
              </DrawerClose>
              <Button type="submit" className="w-full">
                {t('global.cta.filter')}
              </Button>
            </ResponsiveDialogFooter>
          </div>
        </form>  
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
