import { createContext } from "react";

interface AppContextValue {
  // selectedPlanning: Planning | undefined;
  // plannings: Planning[] | undefined;
  // setSelectedPlanning(planning: Planning): void;
}

export const AppContext = createContext({} as AppContextValue);

export function AppProvider({ children }: { children: React.ReactNode }) {
  

  return (
    <AppContext.Provider
      value={{}}
    >
      {children}
    </AppContext.Provider>
  );
}
