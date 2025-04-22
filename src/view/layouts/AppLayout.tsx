import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from "@/view/components/AppSidebar"
import {
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/view/components/ui/sidebar"
import { ChevronsUpDown } from 'lucide-react';
import { usePlanning } from '@/app/hooks/usePlanning';
import { useTranslation } from 'react-i18next';
import { ViewTypeSelectorDropdown } from '../pages/Transactions/components/ViewTypeSelectorDropdown';
import { TransactionsProvider } from '@/app/contexts/TransactionsContext';
import { TransactionsToolbar } from '../pages/Transactions/components/TransactionsToolbar';

export function AppLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { selectedPlanning } = usePlanning()

  return (
    <SidebarProvider className="sm:h-screen sm:overflow-hidden">
      <TransactionsProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="flex z-50 shrink-0 w-full items-center gap-2 bg-background rounded-xl min-h-16">
            <div className="flex items-center justify-between gap-2 px-4 flex-auto flex-wrap">
              <div>
                <SidebarTrigger className="-ml-1" />
                {pathname === '/timeline' && (
                  <ViewTypeSelectorDropdown />
                )}
              </div>
              {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              {pathname !== '/select-planning' && (
                <Link to={'/select-planning'}>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-auto px-4 hover:bg-background-secondary"
                  >
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-xs text-muted-foreground">{t('global.planning')}</span>
                      <span className="truncate font-semibold">{selectedPlanning?.description}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </Link>
              )}
              {pathname === '/timeline' && (
                <TransactionsToolbar selectedPlanning={selectedPlanning} />
              )}
              {pathname !== '/timeline' && (
                <div></div>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 pt-0 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </TransactionsProvider>
    </SidebarProvider>
  );
}
