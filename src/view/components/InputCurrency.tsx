import { NumericFormat } from 'react-number-format';
import { cn } from '../../app/utils/cn';
import { useTranslation } from 'react-i18next';
import { getCurrencySymbol } from '@/app/utils/formatCurrency';
import { usePlanning } from '@/app/hooks/usePlanning';

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  className?: string;
  onChange?(value: string): void;
}

export function InputCurrency({ error, value, className, onChange }: InputCurrencyProps) {
  const { t, i18n } = useTranslation()
  const {selectedPlanning} = usePlanning()

  return (
    <div>
      <NumericFormat
        thousandSeparator
        // thousandSeparator={selectedPlanning?.currency === 'BRL' ? '.' : ','}
        // decimalSeparator={selectedPlanning?.currency === 'BRL' ? ',' : '.'}
        defaultValue={0}
        allowNegative={false}
        allowedDecimalSeparators={['%']}
        // decimalScale={2}
        // prefix={getCurrencySymbol(i18n.language, selectedPlanning?.currency ?? 'BRL') + ' '}
        value={value}
        onChange={event => onChange?.(event.target.value)}
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
