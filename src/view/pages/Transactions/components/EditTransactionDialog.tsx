"use client"

import { Button } from "@/view/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DrawerClose, DrawerTitle } from "@/view/components/ui/drawer"
import { TransactionType } from "@/app/models/TransactionType"
import { Label } from "@/view/components/ui/label"
import { Input } from "@/view/components/ui/input"
import { Spinner } from "@/view/components/ui/Spinner"
import { Switch } from "@/view/components/ui/switch"
import { Controller } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/view/components/ui/popover"
import { Calendar } from "@/view/components/ui/calendar"
import { formatDate } from "@/app/utils/date"
import { cn } from "@/app/utils/cn"
import { CategoriesCombobox } from "@/view/components/CategoriesCombobox"
import { Category } from "@/app/models/Category"
import { InputCurrency } from "@/view/components/InputCurrency"
import { getCurrencySymbol } from "@/app/utils/formatCurrency"
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from "@/view/components/ResponsiveDialog"
import { useEditTransactionController } from "../useEditTransactionController"

export function EditTransactionDialog() {
  const { t, i18n } = useTranslation()
  const { 
    user, 
    selectedPlanning,
    isPending, 
    errors, 
    control, 
    transactionType, 
    isEditTransactionDialogOpen,
    toggleEditTransactionDialog,
    handleSubmit, 
    register, 
  } = useEditTransactionController()

  return (
    <ResponsiveDialog open={isEditTransactionDialogOpen} onOpenChange={toggleEditTransactionDialog}>
      <ResponsiveDialogContent className="flex justify-center" aria-describedby="sfsdf">
        <form className="" onSubmit={handleSubmit}>
          <div className="flex flex-col max-w-[800px] justify-center m-auto w-full">
            <ResponsiveDialogHeader>
              {transactionType === TransactionType.EXPENSE && (
                <DrawerTitle>{t('transactions.forms.titleEditExpense')}</DrawerTitle>
              )}
              {transactionType === TransactionType.INCOME && (        
                <DrawerTitle>{t('transactions.forms.titleEditIncome')}</DrawerTitle>
              )}   
            {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
            </ResponsiveDialogHeader>
            <div className="p-4">
              <div className="mt-6 mb-4 grid gap-4">
                <div className="flex items-baseline justify-between">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">{t('transactions.forms.amount')}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground tracking-[-0.5px] text-lg">
                        {getCurrencySymbol(i18n.language, selectedPlanning?.currency ?? 'BRL')}
                      </span>
                      <Controller
                        control={control}
                        name="amount"
                        render={({ field: { onChange, value }}) => (
                          <InputCurrency value={value} className={transactionType === TransactionType.EXPENSE ? 'text-red' : 'text-green'} onChange={onChange} error={errors.amount?.message as string}/> 
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2 min-w-20">
                    <Label htmlFor="isPaid">{t('transactions.forms.isPaid')}</Label>
                    <Controller
                      control={control}
                      name="isPaid"
                      render={({ field: { onChange, value } }) => (
                      <Switch
                        className="mt-5"
                        id="isPaid"
                        checked={value}
                        onCheckedChange={onChange}
                        {...register('isPaid')}
                      />
                      )}
                    />
                    <span className="inline-block text-sm text-destructive">
                    {t(errors.isPaid?.message as string)}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">{t('transactions.forms.description')}</Label>
                  <Input
                    id="description"
                    type="text"
                    // required
                    {...register('description')}
                  />
                  <span className="inline-block text-sm text-destructive">
                  {t(errors.description?.message as string)}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">{t('transactions.forms.date')}</Label>
                  <Controller
                    control={control}
                    name="date"
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                  />
                  <span className="inline-block text-sm text-destructive">
                  {t(errors.date?.message as string)}
                  </span>
                </div>
                
                <div className="grid gap-2 w-full">
                  <Label htmlFor="category">{t('transactions.forms.category')}</Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, value } }) => (
                      <CategoriesCombobox 
                        categories={user?.categories?.filter((category) => category.type === transactionType)} 
                        onSelect={onChange} 
                        value={value as Category} 
                      />
                    )}
                  />

                  <span className="inline-block text-sm text-destructive">
                  {t(errors.category?.message as string)}
                  </span>
                </div>

                
              </div>
            </div>
            <ResponsiveDialogFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <Spinner />}
                {t('global.cta.update')}
              </Button>
            </ResponsiveDialogFooter>
          </div>
        </form>  
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
