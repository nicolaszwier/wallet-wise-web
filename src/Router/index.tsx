import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import { AuthLayout } from '@/view/layouts/AuthLayout';
import Signin from '@/view/pages/Signin';
import Signup from '@/view/pages/Signup';
import { AppLayout } from '@/view/layouts/AppLayout';
import Dashboard from '@/view/pages/Dashboard';
import SelectPlanning from '@/view/pages/SelectPlanning';
import { PlanningGuard } from './PlanningGuard';
import Timeline from '@/view/pages/Transactions';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route element={<AppLayout />}>
            <Route path="/select-planning" element={<SelectPlanning />} />
            <Route path="/account" element={<h1>Account</h1>} />
            <Route path="/support" element={<h1>Support</h1>} />
            <Route element={<PlanningGuard />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/balances" element={<h1>Balances</h1>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
