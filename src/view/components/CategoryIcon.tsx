import { CircleDollarSign } from "lucide-react"

interface CategoryIconProps {
  icon?: string,
  size?: number
}

export function CategoryIcon({icon, size}: CategoryIconProps) {

  return (
    <div className="rounded-lg bg-slate-300 p-1.5">
      <CircleDollarSign size={size ?? 22} />
    </div>
  )
}