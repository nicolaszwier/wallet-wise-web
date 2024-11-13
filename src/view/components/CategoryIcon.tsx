import { CircleDollarSign } from "lucide-react"

interface CategoryIconProps {
  icon: string
}

export function CategoryIcon({icon}: CategoryIconProps) {

  return (
    <div className="rounded-lg bg-slate-300 p-1.5">
      <CircleDollarSign size={22} />
    </div>
  )
}