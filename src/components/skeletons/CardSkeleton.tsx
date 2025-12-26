import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CardSkeletonProps {
  count?: number
  showImage?: boolean
  showBadges?: boolean
  showFooter?: boolean
}

export function CardSkeleton({ 
  count = 1, 
  showImage = false, 
  showBadges = false,
  showFooter = false 
}: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#E4E7EB]">
          {showImage && (
            <div className="h-48 w-full">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start gap-3">
              {!showImage && (
                <Skeleton className="h-12 w-12 rounded-lg" />
              )}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            {showBadges && (
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            {showFooter && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E4E7EB]">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

