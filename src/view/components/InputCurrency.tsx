import { NumericFormat } from 'react-number-format';
import { cn } from '../../app/utils/cn';
import { useTranslation } from 'react-i18next';
import { usePlanning } from '@/app/hooks/usePlanning';
import { getCurrencySymbol } from '@/app/utils/formatCurrency';

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  className?: string;
  currency?: string;
  onChange?(value: string): void;
}

const isBRL = (currency: string) => currency === 'BRL';

export function parseCurrencyValue(value: string): number {
  if (!value?.trim()) return NaN;
  return parseFloat(value.replace(',', '.'));
}

export function InputCurrency({
  error,
  value,
  className,
  currency: currencyProp,
  onChange,
}: InputCurrencyProps) {
  const { t, i18n } = useTranslation();
  const { selectedPlanning } = usePlanning();
  const currency = currencyProp ?? selectedPlanning?.currency ?? 'BRL';
  const thousandSeparator = isBRL(currency) ? '.' : ',';
  const decimalSeparator = isBRL(currency) ? ',' : '.';
  const symbol = getCurrencySymbol(i18n.language, currency);

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-muted-foreground shrink-0 text-lg">{symbol}</span>
        <NumericFormat
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          decimalScale={2}
          allowNegative={false}
          allowedDecimalSeparators={['.', ',']}
          inputMode="decimal"
          placeholder={isBRL(currency) ? '0,00' : '0.00'}
          value={value}
          onValueChange={(values) => onChange?.(values.value ?? '')}
          className={cn(
            'bg-background w-full rounded py-0 font-bold tracking-[-1px] outline-none text-[40px]',
            className,
            error && 'text-red-900',
          )}
        />
      </div>

      {error && (
        <span className="inline-block text-sm text-destructive">{t(error)}</span>
      )}
    </div>
  );
}
