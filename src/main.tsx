import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppleAuthProvider } from './app/providers/AppleAuthProvider';
import './i18n';
import { initTelemetryDeck } from './app/analytics/telemetryDeck';

initTelemetryDeck();

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="225965054040-cchb69evf2g0np1f82m85fl91f1dbqtq.apps.googleusercontent.com">
    <AppleAuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AppleAuthProvider>
  </GoogleOAuthProvider>
)
