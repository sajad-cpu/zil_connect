import { Skeleton } from "@/components/ui/skeleton"

interface MessageSkeletonProps {
  count?: number
}

export function MessageSkeleton({ count = 1 }: MessageSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  )
}

