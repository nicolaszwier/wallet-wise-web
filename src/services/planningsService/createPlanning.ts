import { Planning } from '@/app/models/Planning';
import { httpClient } from '../httpClient';

export interface CreatePlanningParams {
  description: string;
  currency: string;
}

export async function createPlanning(params: CreatePlanningParams) {
  const { data } = await httpClient.post<Planning>('/plannings', params);
  return data;
}
