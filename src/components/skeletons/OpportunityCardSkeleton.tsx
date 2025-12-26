import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface OpportunityCardSkeletonProps {
  count?: number
}

export function OpportunityCardSkeleton({ count = 1 }: OpportunityCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#E4E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#E4E7EB]">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

