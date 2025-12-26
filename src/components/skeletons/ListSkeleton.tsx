import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ListSkeletonProps {
  count?: number
  showImage?: boolean
  showActions?: boolean
}

export function ListSkeleton({ 
  count = 1, 
  showImage = false,
  showActions = false 
}: ListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#E4E7EB]">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {showImage && (
                <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  {showActions && (
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-md" />
                      <Skeleton className="h-9 w-20 rounded-md" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

