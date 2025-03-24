import logo from '@/assets/ww-logo.png'
import { Logo } from './Logo';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  // className?: string;
}

export function LoadingScreen({}: LogoProps) {
    const { t } = useTranslation()
return (
   <div className="h-screen w-screen flex justify-center flex-col items-center gap-3">
    <Logo className="w-20 h-20 rounded-xl" />
    <p className="text-2xl font-normal">{t('global.loading')}</p>
   </div>
  );
}
