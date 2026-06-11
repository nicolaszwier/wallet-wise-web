import TelemetryDeck from '@telemetrydeck/sdk';
import { localStorageKeys } from '@/app/config/localStorageKeys';

const ANONYMOUS_USER_KEY = 'ww:analyticsAnonymousId';

function getOrCreateAnonymousId(): string {
  const existing = localStorage.getItem(ANONYMOUS_USER_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(ANONYMOUS_USER_KEY, id);
  return id;
}

let client: TelemetryDeck | null = null;

export function initTelemetryDeck(): TelemetryDeck | null {
  const appID = import.meta.env.VITE_TELEMETRYDECK_APP_ID;
  if (!appID || appID === 'YOUR-TELEMETRYDECK-APP-ID') {
    if (import.meta.env.DEV) {
      console.info('TelemetryDeck: set VITE_TELEMETRYDECK_APP_ID to enable analytics');
    }
    return null;
  }

  if (!client) {
    client = new TelemetryDeck({
      appID,
      clientUser: getOrCreateAnonymousId(),
    });
  }

  return client;
}

export function getTelemetryDeckClient(): TelemetryDeck | null {
  return client ?? initTelemetryDeck();
}

export function isAnalyticsOptedOut(): boolean {
  return localStorage.getItem(localStorageKeys.ANALYTICS_OPT_OUT) === 'true';
}

export function setAnalyticsOptOut(optOut: boolean): void {
  localStorage.setItem(localStorageKeys.ANALYTICS_OPT_OUT, optOut ? 'true' : 'false');
}
