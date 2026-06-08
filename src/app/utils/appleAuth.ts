const APPLE_SDK_URL =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

let sdkPromise: Promise<void> | null = null;
let initialized = false;
let initOrigin: string | null = null;

function isLocalhostOrigin(origin: string) {
  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function getAppleAuthError(): string | null {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;

  if (!clientId) {
    return "Apple Sign-In is not configured (missing VITE_APPLE_CLIENT_ID).";
  }

  if (isLocalhostOrigin(window.location.origin)) {
    return "LOCALHOST";
  }

  if (typeof AppleID === "undefined") {
    return "Apple Sign-In SDK is still loading. Please try again in a moment.";
  }

  if (!initialized) {
    return "Apple Sign-In is not initialized yet. Please try again in a moment.";
  }

  return null;
}

export function loadAppleSdk(): Promise<void> {
  if (typeof AppleID !== "undefined") {
    return Promise.resolve();
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        "script[data-apple-signin-sdk]"
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => {
          reject(new Error("Failed to load Apple Sign-In SDK"));
        }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = APPLE_SDK_URL;
      script.dataset.appleSigninSdk = "true";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Apple Sign-In SDK"));
      document.head.appendChild(script);
    });
  }

  return sdkPromise;
}

export async function initAppleAuth(): Promise<boolean> {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
  const origin = window.location.origin;

  if (!clientId) {
    console.warn("Apple Sign-In: set VITE_APPLE_CLIENT_ID in .env");
    return false;
  }

  if (isLocalhostOrigin(origin)) {
    console.warn(
      "Apple Sign-In: localhost is not supported by Apple. Use ngrok or a custom domain via /etc/hosts."
    );
    return false;
  }

  await loadAppleSdk();

  if (initialized && initOrigin === origin) {
    return true;
  }

  AppleID.auth.init({
    clientId,
    scope: "name email",
    redirectURI: origin,
    usePopup: true,
  });

  initialized = true;
  initOrigin = origin;
  console.info("Apple Sign-In initialized for", origin);
  return true;
}

export function startAppleSignIn(): Promise<AppleSignInResponse> {
  const readinessError = getAppleAuthError();

  if (readinessError) {
    return Promise.reject(new Error(readinessError));
  }

  return AppleID.auth.signIn();
}
