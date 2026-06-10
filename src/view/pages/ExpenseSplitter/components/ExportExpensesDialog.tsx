import { Button } from '@/view/components/ui/button';
import { Label } from '@/view/components/ui/label';
import { Switch } from '@/view/components/ui/switch';
import { Spinner } from '@/view/components/ui/spinner';
import { Calendar } from '@/view/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/view/components/ui/popover';
import { CategoriesCombobox } from '@/view/components/CategoriesCombobox';
import { SelectField } from '@/view/components/SelectField';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '@/view/components/ResponsiveDialog';
import { DrawerTitle } from '@/view/components/ui/drawer';
import { formatDate } from '@/app/utils/date';
import { cn } from '@/app/utils/cn';
import { CalendarIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useExportExpensesController } from '../useExportExpensesController';
import { Category } from '@/app/models/Category';
import { Planning } from '@/app/models/Planning';
import { TransactionType } from '@/app/models/TransactionType';
import { formatCurrency } from '@/app/utils/formatCurrency';

interface ExportExpensesDialogProps {
  controller: ReturnType<typeof useExportExpensesController>;
  currency: string;
}

export function ExportExpensesDialog({ controller, currency }: ExportExpensesDialogProps) {
  const { t, i18n } = useTranslation();
  const {
    open,
    setOpen,
    itemsToExport,
    transactionType,
    handleSubmit,
    control,
    errors,
    isPending,
    categories,
    allCategories,
    plannings,
    selectedPlanning,
  } = controller;

  const isBulk = itemsToExport.length > 1;
  const isIncome = transactionType === TransactionType.INCOME;

  const dialogTitle = isBulk
    ? isIncome
      ? t('expenseSplitter.export.dialogTitleIncomeAll', { count: itemsToExport.length })
      : t('expenseSplitter.export.dialogTitleAll', { count: itemsToExport.length })
    : isIncome
      ? t('expenseSplitter.export.dialogTitleIncome')
      : t('expenseSplitter.export.dialogTitle');

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="w-full">
          <ResponsiveDialogHeader>
            <DrawerTitle>{dialogTitle}</DrawerTitle>
          </ResponsiveDialogHeader>

          <div className="flex flex-col gap-4 py-4">
              {!isBulk && itemsToExport[0] && (
                <>
                  <div>
                    <Label>{t('transactions.forms.description')}</Label>
                    <p className="text-sm font-medium mt-1">{itemsToExport[0].description}</p>
                  </div>
                  <div>
                    <Label>{t('transactions.forms.amount')}</Label>
                    <p
                      className={cn(
                        'text-sm font-semibold mt-1',
                        isIncome ? 'text-green' : 'text-red',
                      )}
                    >
                      {formatCurrency(itemsToExport[0].amount, currency, i18n.language)}
                    </p>
                  </div>
                </>
              )}

              {isBulk && (
                <p className="text-sm text-muted-foreground">
                  {t('expenseSplitter.export.bulkHint', { count: itemsToExport.length })}
                </p>
              )}

              {!selectedPlanning && plannings.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="planning">{t('global.planning')}</Label>
                  <Controller
                    control={control}
                    name="planningId"
                    render={({ field }) => (
                      <SelectField
                        id="planning"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('expenseSplitter.export.selectPlanning')}
                        options={plannings.map((p: Planning) => ({
                          value: p.id,
                          label: p.description,
                        }))}
                      />
                    )}
                  />
                  {errors.planningId && (
                    <span className="text-sm text-destructive">
                      {t(errors.planningId.message as string)}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>{t('transactions.forms.category')}</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <CategoriesCombobox
                      categories={categories}
                      allCategories={allCategories}
                      value={field.value as Category}
                      onSelect={field.onChange}
                      transactionType={transactionType}
                    />
                  )}
                />
                {errors.category && (
                  <span className="text-sm text-destructive">
                    {t(errors.category.message as string)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>{t('transactions.forms.date')}</Label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn('w-full justify-start text-left font-normal')}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? formatDate(field.value, i18n.language) : t('transactions.forms.date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="isPaid"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="isPaid" />
                  )}
                />
                <Label htmlFor="isPaid">
                  {isIncome ? t('expenseSplitter.export.isReceived') : t('transactions.forms.isPaid')}
                </Label>
              </div>
            </div>

            <ResponsiveDialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t('global.cta.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner className="mr-2" />}
                {isIncome
                  ? t('expenseSplitter.export.submitIncome')
                  : t('expenseSplitter.export.submit')}
              </Button>
            </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
