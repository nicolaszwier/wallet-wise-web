import { NavUser } from "@/view/components/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/view/components/ui/sidebar"
import {
  ChartPie,
  CircleDollarSign,
  LayoutDashboard,
  LifeBuoy,
  Send
} from "lucide-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { Logo } from "./Logo"
import { useTranslation } from "react-i18next"

const data = {
  navSecondary: [
    {
      title: "global.menu.support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "global.menu.feedback",
      url: "#",
      icon: Send,
    },
  ],
  items: [
    {
      title: "global.menu.dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "global.menu.timeline",
      url: "/timeline",
      icon: CircleDollarSign,
    },
    {
      title: "global.menu.monthlyBalances",
      url: "/balances",
      icon: ChartPie,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const {setOpenMobile} = useSidebar()
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo className="w-full rounded-sm" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">WalletWise</span>
                  <span className="truncate text-xs">{t('global.personalFinances')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
      <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={() => {setOpenMobile(false)}}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup {...props} className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm">
                    <Link to={item.url}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
