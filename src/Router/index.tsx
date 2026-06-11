import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import { AuthLayout } from '@/view/layouts/AuthLayout';
import Signin from '@/view/pages/Signin';
import Signup from '@/view/pages/Signup';
import ForgotPassword from '@/view/pages/ForgotPassword';
import ResetPassword from '@/view/pages/ResetPassword';
import Account from '@/view/pages/Account';
import { AppLayout } from '@/view/layouts/AppLayout';
import Dashboard from '@/view/pages/Dashboard';
import SelectPlanning from '@/view/pages/SelectPlanning';
import { PlanningGuard } from './PlanningGuard';
import { OnboardingGuard } from './OnboardingGuard';
import Onboarding from '@/view/pages/Onboarding';
import Timeline from '@/view/pages/Transactions';
import Balances from '@/view/pages/Balances';
import ExpenseSplitter from '@/view/pages/ExpenseSplitter';
import RecurringTransactions from '@/view/pages/RecurringTransactions';
import CategoriesPage from '@/view/pages/Categories';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/splitter" element={<ExpenseSplitter />} />
        </Route>

        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={<OnboardingGuard />}>
            <Route element={<AppLayout />}>
              <Route path="/select-planning" element={<SelectPlanning />} />
              <Route path="/account" element={<Account />} />
              <Route path="/support" element={<h1>Support</h1>} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route element={<PlanningGuard />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/recurring-transactions" element={<RecurringTransactions />} />
                <Route path="/balances" element={<Balances />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
