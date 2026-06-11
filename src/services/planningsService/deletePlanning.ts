import { httpClient } from '../httpClient';

interface DeletePlanningResponse {
  statusCode: number;
  message: string;
  error: string | null;
}

export async function deletePlanning(planningId: string) {
  const { data } = await httpClient.delete<DeletePlanningResponse>(`/plannings/${planningId}`);
  return data;
}
