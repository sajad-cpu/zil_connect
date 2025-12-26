import { adminService } from "@/api/services/adminService";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building2,
  DollarSign,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-platform-stats"],
    queryFn: () => adminService.getPlatformStats(),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Platform analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            description="Registered users"
          />
          <StatsCard
            title="Total Businesses"
            value={stats?.totalBusinesses || 0}
            icon={Building2}
            description="Business profiles"
          />
          <StatsCard
            title="Active Opportunities"
            value={stats?.totalOpportunities || 0}
            icon={Briefcase}
            description="Available opportunities"
          />
          <StatsCard
            title="Total Offers"
            value={stats?.totalOffers || 0}
            icon={Tag}
            description="Active offers"
          />
          <StatsCard
            title="Product Enrollments"
            value={stats?.totalEnrollments || 0}
            icon={TrendingUp}
            description="Business tool enrollments"
          />
          <StatsCard
            title="Paid Commissions"
            value={stats?.paidCommissions || 0}
            icon={DollarSign}
            description="Total paid"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Chart visualization coming soon...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Chart visualization coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

