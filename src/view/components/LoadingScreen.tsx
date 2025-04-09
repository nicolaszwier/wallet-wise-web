import { Logo } from './Logo';
import { useTranslation } from 'react-i18next';

export function LoadingScreen() {
  const { t } = useTranslation()
  return (
    <div className="h-screen w-screen flex justify-center flex-col items-center gap-3">
      <Logo className="w-20 h-20 rounded-xl animate-pulse" />
      <p className="text-2xl font-normal animate-pulse">{t('global.loading')}</p>
    </div>
  );
}
