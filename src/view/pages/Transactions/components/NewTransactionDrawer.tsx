"use client"

import { Button } from "@/view/components/ui/button"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/view/components/ui/drawer"

export function NewTransactionDrawer() {
  const { t, i18n } = useTranslation()
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="xs">
          <Plus /> {t('transactions.addTransaction')}
        </Button>
        </DrawerTrigger>
        <DrawerContent className="flex justify-center">
        <div className="flex flex-col max-w-[800px] justify-center m-auto w-full">
          <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          </DrawerFooter>
        </div>
        </DrawerContent>
    </Drawer>
  )
}
