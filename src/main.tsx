import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="225965054040-cchb69evf2g0np1f82m85fl91f1dbqtq.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>,
  </GoogleOAuthProvider>
)
