/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APPLE_CLIENT_ID: string;
  readonly VITE_TELEMETRYDECK_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
