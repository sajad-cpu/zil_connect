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

const iconMap: Record<string, any> = {
  Users,
  Building2,
  Briefcase,
  Tag,
  TrendingUp,
  DollarSign,
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-platform-stats"],
    queryFn: () => adminService.getPlatformStats(),
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: () => adminService.getRecentActivity(10),
  });

  if (statsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            description="Registered users on the platform"
          />
          <StatsCard
            title="Total Businesses"
            value={stats?.totalBusinesses || 0}
            icon={Building2}
            description="Business profiles created"
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
            title="Commission Revenue"
            value={`$${stats?.paidCommissions || 0}`}
            icon={DollarSign}
            description="Total paid commissions"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Manage users, businesses, and content from the sidebar navigation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-gray-600">Loading activity...</p>
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = iconMap[activity.icon] || Users;
                    return (
                      <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-8">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

