import { useIsMobile } from "@/app/hooks/useIsMobile";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "./ui/drawer";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface ComponentProps {
  open?: boolean,
  onOpenChange?: Dispatch<SetStateAction<boolean>>,
  children: ReactNode
}

export function ResponsiveDialog({open, onOpenChange, children}: ComponentProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

export function ResponsiveDialogContent({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerContent className={className}>
        {children}
      </DrawerContent>
    )
  }

  return (
    <DialogContent className={className}>
      {children}
    </DialogContent>
  )
}

export function ResponsiveDialogHeader({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerHeader className={className}>
        {children}
      </DrawerHeader>
    )
  }

  return (
    <DialogHeader className={className}>
      {children}
    </DialogHeader>
  )
}

export function ResponsiveDialogFooter({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <DrawerFooter className={className}>
        {children}
      </DrawerFooter>
    )
  }

  return (
    <DialogFooter className={className}>
      {children}
    </DialogFooter>
  )
}