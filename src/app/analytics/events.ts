/** Shared signal names — keep in sync with WalletWise/Services/Analytics/AnalyticsEvent.swift */
export const AnalyticsSignal = {
  screenViewed: 'screen_viewed',
  tabSelected: 'tab_selected',
  authSucceeded: 'auth_succeeded',
  authFailed: 'auth_failed',
  welcomeCompleted: 'welcome_completed',
  planningCreated: 'planning_created',
  transactionCreated: 'transaction_created',
  apiError: 'api_error',
  emptyStateViewed: 'empty_state_viewed',
  actionAbandoned: 'action_abandoned',
} as const;

export const AnalyticsPlatform = {
  web: 'web',
  ios: 'ios',
} as const;

export type AuthMethod = 'google' | 'apple' | 'email' | 'signup';

export const SCREEN_BY_PATH: Record<string, string> = {
  '/signin': 'signin',
  '/signup': 'signup',
  '/onboarding': 'welcome',
  '/': 'dashboard',
  '/timeline': 'timeline',
  '/balances': 'balances',
  '/recurring-transactions': 'recurring',
  '/categories': 'categories',
  '/splitter': 'expense_splitter',
  '/account': 'account',
  '/select-planning': 'select_planning',
  '/forgot-password': 'forgot_password',
  '/reset': 'reset_password',
  '/support': 'support',
};

export function screenNameFromPath(pathname: string): string {
  return SCREEN_BY_PATH[pathname] ?? (pathname.replace(/^\//, '').replace(/\//g, '_') || 'unknown');
}
