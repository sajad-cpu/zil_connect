import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface BusinessCardSkeletonProps {
  count?: number
}

export function BusinessCardSkeleton({ count = 1 }: BusinessCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#E4E7EB]">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#F8F9FC] rounded-lg">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

