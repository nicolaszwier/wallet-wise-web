import { usePlanning } from "@/app/hooks/usePlanning";
import { Navigate, Outlet } from "react-router-dom";

interface AuthGuardProps {
  // isPrivate: boolean;
}

export function PlanningGuard() {
  const { selectedPlanning } = usePlanning();
  
  if (!selectedPlanning) {
    return <Navigate to="/select-planning" replace />;
  }

  return <Outlet />;
}
