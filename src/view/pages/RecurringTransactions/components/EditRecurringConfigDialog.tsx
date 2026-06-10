"use client";

import { RecurringConfig } from '@/app/models/RecurringConfig';
import { RecurrenceFrequency } from '@/app/models/RecurrenceFrequency';
import { TransactionType } from '@/app/models/TransactionType';
import { Category } from '@/app/models/Category';
import { getGroupedCategoriesForPicker } from '@/app/utils/categories';
import { formatCalendarDate } from '@/app/utils/date';
import { cn } from '@/app/utils/cn';
import { CategoriesCombobox } from '@/view/components/CategoriesCombobox';
import { InputCurrency } from '@/view/components/InputCurrency';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from '@/view/components/ResponsiveDialog';
import { SelectField } from '@/view/components/SelectField';
import { Button } from '@/view/components/ui/button';
import { Calendar } from '@/view/components/ui/calendar';
import { DrawerClose, DrawerTitle } from '@/view/components/ui/drawer';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/view/components/ui/popover';
import { Spinner } from '@/view/components/ui/spinner';
import { CalendarIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEditRecurringConfigController } from '../useEditRecurringConfigController';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  activeConfig: RecurringConfig | null;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function EditRecurringConfigDialog({ activeConfig, isOpen, onOpenChange }: Props) {
  const { t, i18n } = useTranslation();
  const {
    categories,
    handleSubmit,
    register,
    isPending,
    errors,
    control,
    transactionType,
    setValue,
  } = useEditRecurringConfigController({
    activeConfig,
    isOpen,
    onClose: () => onOpenChange(false),
  });

  const frequencyOptions = [
    { value: RecurrenceFrequency.WEEKLY, label: t('recurringTransactions.frequency.weekly') },
    { value: RecurrenceFrequency.MONTHLY, label: t('recurringTransactions.frequency.monthly') },
    { value: RecurrenceFrequency.YEARLY, label: t('recurringTransactions.frequency.yearly') },
  ];

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex justify-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col max-w-[800px] justify-center m-auto w-full">
            <ResponsiveDialogHeader>
              <DrawerTitle>
                {transactionType === TransactionType.EXPENSE
                  ? t('recurringTransactions.forms.titleEditExpense')
                  : t('recurringTransactions.forms.titleEditIncome')}
              </DrawerTitle>
              <p className="text-sm text-muted-foreground px-4">
                {t('recurringTransactions.forms.editWarning')}
              </p>
            </ResponsiveDialogHeader>
            <div className="p-4 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">{t('transactions.forms.amount')}</Label>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <InputCurrency
                      value={value}
                      className={transactionType === TransactionType.EXPENSE ? 'text-red' : 'text-green'}
                      onChange={onChange}
                      error={errors.amount?.message as string}
                    />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t('transactions.forms.description')}</Label>
                <Input id="description" type="text" {...register('description')} />
                <span className="text-sm text-destructive">{t(errors.description?.message as string)}</span>
              </div>
              <div className="grid gap-2">
                <Label>{t('recurringTransactions.forms.startDate')}</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field: { onChange, value } }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-background-tertiary">
                          <CalendarIcon />
                          {formatCalendarDate(value, i18n.language)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={value} onSelect={onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('transactions.forms.category')}</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <CategoriesCombobox
                      categories={getGroupedCategoriesForPicker(categories, transactionType)}
                      allCategories={categories}
                      onSelect={onChange}
                      value={value as Category}
                      transactionType={transactionType}
                    />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('recurringTransactions.forms.frequency')}</Label>
                <Controller
                  control={control}
                  name="frequency"
                  render={({ field: { onChange, value } }) => (
                    <SelectField
                      value={value}
                      options={frequencyOptions}
                      onChange={onChange}
                      placeholder={t('recurringTransactions.forms.frequency')}
                    />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('recurringTransactions.forms.endDate')}</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field: { onChange, value } }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn('w-full justify-start bg-background-tertiary', !value && 'text-muted-foreground')}
                        >
                          <CalendarIcon />
                          {value ? formatCalendarDate(value, i18n.language) : t('recurringTransactions.forms.endDateOptional')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={value ?? undefined} onSelect={onChange} />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Button type="button" variant="ghost" size="sm" className="justify-start px-0 h-auto text-xs" onClick={() => setValue('endDate', null)}>
                  {t('recurringTransactions.forms.clearEndDate')}
                </Button>
              </div>
            </div>
            <ResponsiveDialogFooter className="sm:flex flex-col-reverse px-4">
              <DrawerClose asChild>
                <Button variant="ghost">{t('global.cta.cancel')}</Button>
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
  );
}
