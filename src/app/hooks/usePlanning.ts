import { useContext } from "react";
import { PlanningContext } from "../contexts/PlanningContext";

export function usePlanning() {
  return useContext(PlanningContext);
}
