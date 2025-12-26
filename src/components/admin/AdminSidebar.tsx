import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createPageUrl } from "@/utils";
import {
  BarChart3,
  Briefcase,
  Building2,
  CreditCard,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Tag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const adminMenuItems = [
  { title: "Dashboard", url: createPageUrl("Admin"), icon: LayoutDashboard },
  { title: "Users", url: "/allusers", icon: Users },
  { title: "Businesses", url: createPageUrl("AdminBusinesses"), icon: Building2 },
  { title: "Opportunities", url: createPageUrl("AdminOpportunities"), icon: Briefcase },
  { title: "Offers", url: createPageUrl("AdminOffers"), icon: Tag },
  { title: "Messages", url: createPageUrl("AdminMessages"), icon: MessageSquare },
  { title: "Business Tools", url: createPageUrl("AdminFintechProducts"), icon: CreditCard },
  { title: "Enrollments", url: createPageUrl("AdminEnrollments"), icon: TrendingUp },
  { title: "Commissions", url: createPageUrl("AdminCommissions"), icon: BarChart3 },
  { title: "Analytics", url: createPageUrl("AdminAnalytics"), icon: BarChart3 },
  { title: "Settings", url: createPageUrl("AdminSettings"), icon: Settings },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentPath = location.pathname;

  return (
    <>
      <div className="hidden md:flex flex-col w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">Platform Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.url || currentPath.startsWith(item.url + "/");
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#6C4DE6] text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="text-white hover:bg-gray-800"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        {isMobileOpen && (
          <nav className="p-4 space-y-1 border-t border-gray-800">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.url || currentPath.startsWith(item.url + "/");
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#6C4DE6] text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </>
  );
}

