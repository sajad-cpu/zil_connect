import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <Card className="border-none shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative">
                <Skeleton className="w-32 h-32 rounded-2xl" />
                <Skeleton className="absolute bottom-0 right-0 w-10 h-10 rounded-full" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-96" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="text-center border-l border-gray-200 space-y-2 pl-4">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
              <div className="text-center border-l border-gray-200 space-y-2 pl-4">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="text-center border-l border-gray-200 space-y-2 pl-4">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-10 w-32 rounded-md mt-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

