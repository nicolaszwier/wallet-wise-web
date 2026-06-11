import { httpClient } from "../httpClient";
import { Planning } from "@/app/models/Planning";
import { fetchCurrencies } from "./fetchCurrencies";
import { updatePlanning } from "./updatePlanning";

export const planningsService = {
  fetchPlannings,
  fetchCurrencies,
  updatePlanning,
};

type PlanningsResponse = Planning[];

async function fetchPlannings() {
  const { data } = await httpClient.get<PlanningsResponse>('/plannings');

  return data;
}
