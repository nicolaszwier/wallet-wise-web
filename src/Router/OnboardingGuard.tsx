import { useOnboarding } from '@/app/hooks/useOnboarding';
import { Navigate, Outlet } from 'react-router-dom';

export function OnboardingGuard() {
  const { isCompleted } = useOnboarding();

  if (!isCompleted()) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
