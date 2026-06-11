import { useTranslation } from 'react-i18next';

interface WelcomeStepProps {
  step: 1 | 2 | 3;
}

export function WelcomeStep({ step }: WelcomeStepProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 text-center">
      <h2 className="text-xl font-semibold">{t(`onboarding.step${step}.title`)}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t(`onboarding.step${step}.description`)}
      </p>
    </div>
  );
}
