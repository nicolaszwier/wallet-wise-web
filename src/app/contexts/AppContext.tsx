import { createContext } from "react";
import { usePreferredView } from "../hooks/usePreferredView";
import { ViewType } from "../models/ViewType";

interface AppContextValue {
  preferredView: ViewType
  changePreferredView(view: ViewType): void;
}

export const AppContext = createContext({} as AppContextValue);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { preferredView, changePreferredView } = usePreferredView()

  return (
    <AppContext.Provider
      value={{
        preferredView,
        changePreferredView
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
