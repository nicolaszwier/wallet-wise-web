import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "react-hot-toast";
import { Router } from "./Router";
import { AuthProvider } from "./app/contexts/AuthContext";
import { AppProvider } from "./app/contexts/AppContext";
import { PlanningProvider } from "./app/contexts/PlanningContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <PlanningProvider>
            <Router />
            <Toaster />
          </PlanningProvider>
        </AppProvider>
      </AuthProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
