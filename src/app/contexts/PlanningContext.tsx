import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import { localStorageKeys } from "../config/localStorageKeys";
import { planningsService } from "@/services/planningsService";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { Planning } from "../models/Planning";
import { useTranslation } from "react-i18next";

interface PlanningContextValue {
  selectedPlanning: Planning | undefined;
  plannings: Planning[] | undefined;
  setSelectedPlanning(planning: Planning): void;
}

export const PlanningContext = createContext({} as PlanningContextValue);

export function PlanningProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const {signedIn} = useAuth()
  const [planning, setPlanning] = useState<Planning | undefined>(() => {
    const storedPlanning = localStorage.getItem(localStorageKeys.SELECTED_PLANNING);

    if (storedPlanning) {
      return JSON.parse(storedPlanning)
    }

    return undefined;
  });

  const { isError, isFetching, data, error } = useQuery({
    queryKey: ['planning'],
    queryFn: () => planningsService.fetchPlannings(),
    enabled: signedIn,
    staleTime: Infinity,
  });

  const setSelectedPlanning = useCallback((planning: Planning) => {
    localStorage.setItem(localStorageKeys.SELECTED_PLANNING, JSON.stringify(planning));
    setPlanning(planning);
  }, []);

  useEffect(() => {
    if (isError) {
      console.log("error", error);
      const err = error as AxiosError
      if (err.status === 401) {
        toast.error(t('errors.authError'));
      } else {
        toast.error(t('errors.fetchPlannings'));
      }
    }
  }, [isError, error]);

  return (
    <PlanningContext.Provider
      value={{
        selectedPlanning: planning,
        plannings: data,
        setSelectedPlanning
      }}
    >

      {isFetching && (
        <div>loading planning</div>
      )}

      {!isFetching && children}
    </PlanningContext.Provider>
  );
}
