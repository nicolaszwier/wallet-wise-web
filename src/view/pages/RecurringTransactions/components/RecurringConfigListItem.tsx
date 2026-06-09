import { RecurringConfig } from '@/app/models/RecurringConfig';
import { TransactionType } from '@/app/models/TransactionType';
import { formatCalendarDate } from '@/app/utils/date';
import { formatCurrency } from '@/app/utils/formatCurrency';
import { CategoryIcon } from '@/view/components/CategoryIcon';
import { Button } from '@/view/components/ui/button';
import { Category } from '@/app/models/Category';
import { PencilIcon, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  config: RecurringConfig;
  category?: Category;
  currency: string;
  onEdit: (config: RecurringConfig) => void;
  onDelete: (config: RecurringConfig) => void;
}

export function RecurringConfigListItem({ config, category, currency, onEdit, onDelete }: Props) {
  const { t, i18n } = useTranslation();
  const isExpense = config.type === TransactionType.EXPENSE;

  const frequencyLabel = {
    WEEKLY: t('recurringTransactions.frequency.weekly'),
    MONTHLY: t('recurringTransactions.frequency.monthly'),
    YEARLY: t('recurringTransactions.frequency.yearly'),
  }[config.frequency];

  return (
    <div className="flex w-full items-center gap-3 rounded-md bg-background-secondary p-3">
      <CategoryIcon size={20} icon={category?.icon ?? ''} />
      <div className="grid flex-1 min-w-0 text-left">
        <span className="truncate text-sm font-semibold">{config.description}</span>
        <span className="truncate text-xs text-muted-foreground">
          {frequencyLabel} · {formatCalendarDate(config.startDate, i18n.language)}
          {config.endDate && ` → ${formatCalendarDate(config.endDate, i18n.language)}`}
        </span>
        <span className="truncate text-xs">{category?.description}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-sm font-semibold ${isExpense ? 'text-red' : 'text-green'}`}>
          {formatCurrency(Math.abs(config.amount), currency, i18n.language)}
        </span>
        <div className="flex gap-1">
          <Button title={t('global.cta.edit')} variant="ghost" size="xs" onClick={() => onEdit(config)}>
            <PencilIcon size={16} />
          </Button>
          <Button title={t('global.cta.delete')} variant="ghost" size="xs" onClick={() => onDelete(config)}>
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
