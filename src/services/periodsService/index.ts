
import { httpClient } from "../httpClient";
import { Period } from "@/app/models/Period";

export const periodsService = {
  fetch,
};

type PeriodsResponse = Period[];
export interface PeriodRequestFilters {
  sortOrder: 'asc' | 'desc';
  startDate: string;
  endDate: string;
}

async function fetch(planningId: string, params: PeriodRequestFilters) {
  const { data } = await httpClient.get<PeriodsResponse>(`/periods/${planningId}`, {params});
  return data;
}
