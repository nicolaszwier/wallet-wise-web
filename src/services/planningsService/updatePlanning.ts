import { httpClient } from "../httpClient";

export interface UpdatePlanningParams {
  description: string;
  currency: string;
}

interface UpdatePlanningResponse {
  statusCode: number;
  message: string;
  error: string | null;
}

export async function updatePlanning(planningId: string, params: UpdatePlanningParams) {
  const { data } = await httpClient.put<UpdatePlanningResponse>(
    `/plannings/${planningId}`,
    params,
  );

  return data;
}
