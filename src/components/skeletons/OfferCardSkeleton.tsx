import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface OfferCardSkeletonProps {
  count?: number
}

export function OfferCardSkeleton({ count = 1 }: OfferCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#E4E7EB] overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-[#6C4DE6] to-[#7E57C2]">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

