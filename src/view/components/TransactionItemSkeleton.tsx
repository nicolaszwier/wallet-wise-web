import { Skeleton } from "./ui/skeleton";

export function TransactionItemSkeleton() {

  return (
    <div className="p-4 flex items-start space-x-4 flex-grow">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div> 
  )
}