import { usePlanning } from "@/app/hooks/usePlanning"
import { Avatar, AvatarFallback, AvatarImage } from "@/view/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/view/components/ui/card"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/view/components/ui/sidebar"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export default function SelectPlanning() {
  const {t} = useTranslation()
  const {plannings,setSelectedPlanning} = usePlanning()

  return (
    <div className="flex h-full w-full items-center justify-center px-4">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('selectPlanning.title')}</CardTitle>
        <CardDescription>
          {t('selectPlanning.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SidebarMenu>
          {plannings?.map(el => (
            <div key={el.id}>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild onClick={()=>{setSelectedPlanning(el)}}>
                    <Link to="/">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage alt={el.description} />
                          <AvatarFallback className="rounded-lg">{el.description.charAt(0)}</AvatarFallback>
                        </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{el.description}</span>
                        <span className="truncate text-xs">{el.currency}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </div>
          ))}
        </SidebarMenu>
      </CardContent>
    </Card>
  </div>
  )
}