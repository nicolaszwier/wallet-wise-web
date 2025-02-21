import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from "@/view/components/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/view/components/ui/breadcrumb"
import { Separator } from "@/view/components/ui/separator"
import {
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/view/components/ui/sidebar"
import { ChevronsUpDown } from 'lucide-react';
import { usePlanning } from '@/app/hooks/usePlanning';
import { useTranslation } from 'react-i18next';
import { BalanceCard } from '../components/BalanceCard';

export function AppLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { selectedPlanning } = usePlanning()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex z-50 shrink-0 w-full items-center gap-2 bg-background rounded-xl">
          <div className="flex items-center justify-between gap-2 px-4 flex-auto">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            {/* <Breadcrumb>
              <BreadcrumbList className="flex-nowrap flex-1">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
            {pathname !== '/select-planning' && (
              <Link to={'/select-planning'}>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-auto px-4"
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
              <div className='flex gap-4 h-full'>
                <BalanceCard variant='sm' title={t('global.currentBalance')} amount={selectedPlanning?.currentBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
                <Separator orientation='vertical'  />
                <BalanceCard variant='sm' title={t('global.expectedBalance')} amount={selectedPlanning?.expectedBalance || 0} currency={selectedPlanning?.currency || "BRL"}/>
               </div>
            )}
             {pathname !== '/timeline' && (
              <div></div>
             )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
    // <div className="flex w-full h-full">
    //   <div className="w-full h-full flex items-center justify-center flex-col">
    //       <Outlet />
    //   </div>
    // </div>
  );
}
