import { AnalyticsPlatform, AnalyticsSignal } from './events';
import { getTelemetryDeckClient, isAnalyticsOptedOut } from './telemetryDeck';

export type TrackParams = Record<string, string>;

export function track(signal: string, params: TrackParams = {}): void {
  if (isAnalyticsOptedOut()) return;

  const td = getTelemetryDeckClient();
  if (!td) return;

  void td.signal(signal, {
    ...params,
    platform: AnalyticsPlatform.web,
  });
}

export const analytics = {
  screenViewed: (screen: string) =>
    track(AnalyticsSignal.screenViewed, { screen }),

  tabSelected: (tab: string) =>
    track(AnalyticsSignal.tabSelected, { tab }),

  authSucceeded: (method: string) =>
    track(AnalyticsSignal.authSucceeded, { method }),

  authFailed: (method: string) =>
    track(AnalyticsSignal.authFailed, { method }),

  welcomeCompleted: (completionType: 'finished' | 'skipped') =>
    track(AnalyticsSignal.welcomeCompleted, { completion_type: completionType }),

  planningCreated: () =>
    track(AnalyticsSignal.planningCreated),

  transactionCreated: () =>
    track(AnalyticsSignal.transactionCreated),

  apiError: (endpoint: string, status: number, errorType: string) =>
    track(AnalyticsSignal.apiError, {
      endpoint,
      status: String(status),
      errorType,
    }),

  emptyStateViewed: (screen: string, emptyStateType: string) =>
    track(AnalyticsSignal.emptyStateViewed, {
      screen,
      empty_state_type: emptyStateType,
    }),

  actionAbandoned: (screen: string) =>
    track(AnalyticsSignal.actionAbandoned, { screen }),
};
