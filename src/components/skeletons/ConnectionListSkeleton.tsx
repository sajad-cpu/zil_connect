import { Skeleton } from "@/components/ui/skeleton"

interface ConnectionListSkeletonProps {
  count?: number
}

export function ConnectionListSkeleton({ count = 1 }: ConnectionListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

