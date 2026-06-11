import { Button } from '@/view/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/view/components/ui/card';
import { Spinner } from '@/view/components/ui/spinner';
import { cn } from '@/app/utils/cn';
import { useTranslation } from 'react-i18next';
import { PlanningSetupStep } from './components/PlanningSetupStep';
import { WelcomeStep } from './components/WelcomeStep';
import { useOnboardingController } from './useOnboardingController';
import { useRouteAnalytics } from '@/app/analytics/useRouteAnalytics';

export default function Onboarding() {
  useRouteAnalytics();
  const { t } = useTranslation();
  const {
    step,
    totalSteps,
    planningName,
    setPlanningName,
    currency,
    setCurrency,
    currencies,
    isLoadingCurrencies,
    nameError,
    isFinishing,
    canFinish,
    goNext,
    goBack,
    skip,
    finish,
  } = useOnboardingController();

  const isLastStep = step === totalSteps;
  const isFirstStep = step === 1;

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="pb-2">
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  index + 1 <= step ? 'bg-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {step <= 3 ? (
            <WelcomeStep step={step as 1 | 2 | 3} />
          ) : (
            <PlanningSetupStep
              planningName={planningName}
              onPlanningNameChange={setPlanningName}
              currency={currency}
              onCurrencyChange={setCurrency}
              currencies={currencies}
              isLoadingCurrencies={isLoadingCurrencies}
              nameError={nameError}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            {!isFirstStep && (
              <Button type="button" variant="outline" className="flex-1" onClick={goBack}>
                {t('onboarding.back')}
              </Button>
            )}
            {isLastStep ? (
              <Button
                type="button"
                className="flex-1"
                disabled={!canFinish || isFinishing}
                onClick={finish}
              >
                {isFinishing && <Spinner />}
                {t('onboarding.step4.start')}
              </Button>
            ) : (
              <Button type="button" className="flex-1" onClick={goNext}>
                {t('onboarding.next')}
              </Button>
            )}
          </div>
          {!isLastStep && (
            <Button type="button" variant="ghost" className="w-full" onClick={skip}>
              {t('onboarding.skip')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
