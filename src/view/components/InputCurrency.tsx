import { NumericFormat } from 'react-number-format';
import { cn } from '../../app/utils/cn';
import { useTranslation } from 'react-i18next';
import { usePlanning } from '@/app/hooks/usePlanning';
// import { getCurrencySymbol } from '@/app/utils/formatCurrency';

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  className?: string;
  onChange?(value: string): void;
}

const isBRL = (currency: string) => currency === 'BRL'

export function InputCurrency({ error, value, className, onChange }: InputCurrencyProps) {
  const { t } = useTranslation()
  const { selectedPlanning } = usePlanning()
  const currency = selectedPlanning?.currency ?? 'BRL'
  const thousandSeparator = isBRL(currency) ? '.' : ','
  const decimalSeparator = isBRL(currency) ? ',' : '.'

  return (
    <div>
      <NumericFormat
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        defaultValue={0}
        allowNegative={false}
        allowedDecimalSeparators={['%']}
        // decimalScale={2}
        // prefix={getCurrencySymbol(i18n.language, selectedPlanning?.currency ?? 'BRL') + ' '}
        value={value}
        onValueChange={values => onChange?.(values.value ?? '')}
        className={cn(
          'bg-background text-[40px] font-bold tracking-[-1px] outline-none w-full py-0 rounded',
          className,
          error && 'text-red-900',
        )}
      />

      {error && (
        <span className="inline-block text-sm text-destructive">
        {t(error)}
        </span>
        // <div className="flex gap-2 items-center mt-2 text-red-900">
        //   {/* <CrossCircledIcon /> */}
        //   <span className="text-xs">{error}</span>
        // </div>
      )}
    </div>
  )
}
