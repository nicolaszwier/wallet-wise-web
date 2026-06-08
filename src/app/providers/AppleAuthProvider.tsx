import { useEffect } from "react";

let initialized = false;

export function AppleAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
    const redirectURI = import.meta.env.VITE_APPLE_REDIRECT_URI;

    if (!clientId || !redirectURI || initialized) {
      return;
    }

    AppleID.auth.init({
      clientId,
      scope: "name email",
      redirectURI,
      usePopup: true,
    });

    initialized = true;
  }, []);

  return children;
}
