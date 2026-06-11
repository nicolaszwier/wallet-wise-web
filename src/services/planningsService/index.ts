import { httpClient } from "../httpClient";
import { Planning } from "@/app/models/Planning";
import { createPlanning } from "./createPlanning";
import { deletePlanning } from "./deletePlanning";
import { fetchCurrencies } from "./fetchCurrencies";
import { updatePlanning } from "./updatePlanning";

export const planningsService = {
  fetchPlannings,
  fetchCurrencies,
  createPlanning,
  updatePlanning,
  deletePlanning,
};

type PlanningsResponse = Planning[];

async function fetchPlannings() {
  const { data } = await httpClient.get<PlanningsResponse>('/plannings');

  return data;
}
