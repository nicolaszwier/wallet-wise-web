
import { httpClient } from "../httpClient";
import { Planning } from "@/app/models/Planning";

export const planningsService = {
  fetchPlannings,
};

type PlanningsResponse = Planning[];

async function fetchPlannings() {
  const { data } = await httpClient.get<PlanningsResponse>('/plannings');

  return data;
}
