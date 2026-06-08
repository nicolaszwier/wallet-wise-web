import { useEffect } from "react";
import { initAppleAuth } from "@/app/utils/appleAuth";

export function AppleAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initAppleAuth().catch((error) => {
      console.error("Apple Sign-In init failed:", error);
    });
  }, []);

  return children;
}
