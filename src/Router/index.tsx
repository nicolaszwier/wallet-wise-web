import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';
import { AuthLayout } from '@/view/layouts/AuthLayout';
import Signin from '@/view/pages/Signin';
import Signup from '@/view/pages/Signup';

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
          <Route path="/" element={<h1>Dashboard</h1>} />
          {/* <Route path="/" element={<Dashboard />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
