import { Button } from '@/view/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FirstTransactionCardProps {
  onAddTransaction: () => void;
}

export function FirstTransactionCard({ onAddTransaction }: FirstTransactionCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border bg-background-tertiary p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <PlusCircle className="h-12 w-12 text-primary" strokeWidth={1.5} />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t('dashboard.firstTransaction.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.firstTransaction.description')}
          </p>
        </div>
        <Button className="w-full" onClick={onAddTransaction}>
          {t('dashboard.firstTransaction.cta')}
        </Button>
      </div>
    </div>
  );
}
