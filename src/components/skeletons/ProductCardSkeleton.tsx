import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductCardSkeletonProps {
  count?: number
}

export function ProductCardSkeleton({ count = 1 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#E4E7EB]">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 rounded-lg mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex gap-2 justify-center">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

