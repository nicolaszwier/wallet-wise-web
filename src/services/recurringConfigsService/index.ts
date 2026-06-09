import { RecurringConfig, UpdateRecurringConfigPayload } from '@/app/models/RecurringConfig';
import { httpClient } from '../httpClient';

interface DefaultResponse<T = RecurringConfig> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string | null;
}

export const recurringConfigsService = {
  fetchByPlanning,
  update,
  remove,
};

async function fetchByPlanning(planningId: string) {
  const { data } = await httpClient.get<RecurringConfig[]>(`/recurring-configs/${planningId}`);
  return data;
}

async function update(configId: string, payload: UpdateRecurringConfigPayload) {
  const { data } = await httpClient.put<DefaultResponse>(`/recurring-configs/${configId}`, payload);
  return data;
}

async function remove(configId: string) {
  const { data } = await httpClient.delete<DefaultResponse>(`/recurring-configs/${configId}`);
  return data;
}
