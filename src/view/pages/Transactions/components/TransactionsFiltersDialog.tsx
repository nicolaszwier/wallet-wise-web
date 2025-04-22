"use client"

import { Button } from "@/view/components/ui/button"
import { useTranslation } from "react-i18next"
import { DrawerClose, DrawerTitle } from "@/view/components/ui/drawer"
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from "@/view/components/ResponsiveDialog"
import { useTransactions } from "@/app/hooks/useTransactions"

export function TransactionsFiltersDialog() {
  const { t } = useTranslation()
  const { 
    isFilterTransactionsDialogOpen,
    toggleFilterTransactionsDialog
  } = useTransactions()

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    toggleFilterTransactionsDialog(false)
  }

  return (
    <ResponsiveDialog open={isFilterTransactionsDialogOpen} onOpenChange={toggleFilterTransactionsDialog}>
      <ResponsiveDialogContent className="flex justify-center" aria-describedby="sfsdf">
        <form className="" onSubmit={handleFilter}>
          <div className="flex flex-col max-w-[800px] justify-center m-auto w-full">
            <ResponsiveDialogHeader>
                <DrawerTitle>{t('transactions.filterDialog.title')}</DrawerTitle>
            {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
            </ResponsiveDialogHeader>
            <div className="p-4">

            </div>
            <ResponsiveDialogFooter className="sm:flex flex-col-reverse px-4">
              <DrawerClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DrawerClose>
              <Button type="submit" className="w-full">
                {t('global.cta.filter')}
              </Button>
            </ResponsiveDialogFooter>
          </div>
        </form>  
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
