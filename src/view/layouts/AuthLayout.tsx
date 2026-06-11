import { Outlet } from 'react-router-dom';
import { useRouteAnalytics } from '@/app/analytics/useRouteAnalytics';

export function AuthLayout() {
  useRouteAnalytics();

  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full flex items-center justify-center flex-col">
          <Outlet />
      </div>
    </div>
  );
}
