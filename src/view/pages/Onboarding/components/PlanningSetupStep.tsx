import { CurrencyOption } from '@/services/planningsService/fetchCurrencies';
import { CurrencyPickerField } from '@/view/components/CurrencyPickerField';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Spinner } from '@/view/components/ui/spinner';
import { useTranslation } from 'react-i18next';

interface PlanningSetupStepProps {
  planningName: string;
  onPlanningNameChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  currencies: CurrencyOption[] | undefined;
  isLoadingCurrencies: boolean;
  nameError?: string;
}

export function PlanningSetupStep({
  planningName,
  onPlanningNameChange,
  currency,
  onCurrencyChange,
  currencies,
  isLoadingCurrencies,
  nameError,
}: PlanningSetupStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{t('onboarding.step4.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t('onboarding.step4.description')}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="planning-name">{t('onboarding.step4.planningName')}</Label>
        <Input
          id="planning-name"
          value={planningName}
          onChange={(event) => onPlanningNameChange(event.target.value)}
          placeholder={t('onboarding.step4.planningNamePlaceholder')}
        />
        {nameError && (
          <span className="text-sm text-destructive">{t(nameError)}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="planning-currency">{t('onboarding.step4.currency')}</Label>
        {isLoadingCurrencies ? (
          <div className="flex h-11 items-center justify-center rounded-md border bg-background-tertiary">
            <Spinner />
          </div>
        ) : (
          <CurrencyPickerField
            id="planning-currency"
            value={currency}
            currencies={currencies ?? []}
            onChange={onCurrencyChange}
            placeholder={t('onboarding.step4.currency')}
          />
        )}
      </div>
    </div>
  );
}
