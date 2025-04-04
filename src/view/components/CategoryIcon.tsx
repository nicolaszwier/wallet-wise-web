import { forwardRef } from "react"
import { Icon, IconName } from "./Icon"

interface CategoryIconProps {
  icon: string,
  size?: number,
  onClick?: () => void
}

export const CategoryIcon = forwardRef<HTMLDivElement, CategoryIconProps>(({icon, size, onClick}, ref) => {
  return (
    <div ref={ref} className="rounded-lg p-1.5 bg-background-tertiary" onClick={onClick}>
      <Icon name={icon as IconName} size={size ?? 22} />
    </div>
  )
})