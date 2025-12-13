import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { pb } from "@/api/pocketbaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { businessService } from "@/api/services/businessService";
import {
  Home,
  Search,
  ShoppingBag,
  Tag,
  Users,
  User,
  Settings,
  Calendar,
  Briefcase,
  GraduationCap,
  BarChart3,
  Menu,
  Plus,
  Sparkles,
  Bell,
  MessageSquare,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ScrollProgressIndicator from "@/components/ScrollProgressIndicator";

interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

const navigationItems = [
  { title: "Home", url: createPageUrl("Home"), icon: Home },
  { title: "Search", url: createPageUrl("Search"), icon: Search },
  { title: "Marketplace", url: createPageUrl("Marketplace"), icon: ShoppingBag },
  { title: "Opportunities", url: createPageUrl("Opportunities"), icon: Briefcase },
  { title: "Offers", url: createPageUrl("Offers"), icon: Tag },
  // { title: "Events", url: createPageUrl("Events"), icon: Calendar },
  { title: "Knowledge", url: createPageUrl("Knowledge"), icon: GraduationCap },
  // { title: "Analytics", url: createPageUrl("Analytics"), icon: BarChart3 },
];

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("My Business");

  // Fetch business data for profile display
  const { data: business } = useQuery({
    queryKey: ['business-profile-header'],
    queryFn: () => businessService.getMyBusiness(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Check authentication BEFORE rendering - prevents content flash
  const isAuthenticated = pb.authStore.isValid && pb.authStore.model;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("zil_user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Check authentication for protected pages
  useEffect(() => {
    // Check PocketBase auth state - must have both valid token AND user model
    if (!isAuthenticated) {
      // User is not logged in, redirect to SignIn using React Router
      navigate("/SignIn", { replace: true });
    }
  }, [navigate, isAuthenticated]);

  // Early return prevents rendering if not authenticated - prevents content flash
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    // Clear PocketBase auth
    pb.authStore.clear();

    // Clear localStorage data
    localStorage.removeItem("zil_auth_token");
    localStorage.removeItem("zil_is_authenticated");
    localStorage.removeItem("zil_user_name");
    localStorage.removeItem("zil_user_id");
    localStorage.removeItem("zil_user_data");

    // Redirect to SignIn page using React Router
    navigate("/SignIn", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <ScrollProgressIndicator />
      <style>{`
        :root {
          --primary: #6C4DE6;
          --primary-hover: #593CC9;
          --secondary: #7E57C2;
          --accent-blue: #318FFD;
          --success: #08B150;
          --error: #FF4C4C;
          --bg-main: #F8F9FC;
          --card-surface: #FFFFFF;
          --appbar-bg: #241C3A;
          --sidebar-hover: #3C2F63;
          --sidebar-active: #5C4DE8;
          --text-primary: #1E1E1E;
          --text-secondary: #7C7C7C;
          --border: #E4E7EB;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(108, 77, 230, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(108, 77, 230, 0);
          }
        }

        .nav-animate {
          animation: slideDown 0.5s ease-out;
        }

        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`bg-[#241C3A] text-white shadow-lg sticky top-0 z-50 transition-all duration-300 overflow-hidden ${
          scrolled ? 'backdrop-blur-md bg-[#241C3A]/95 shadow-2xl' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className={`flex items-center justify-between transition-all duration-300 overflow-x-hidden ${
            scrolled ? 'h-14' : 'h-16'
          }`}>
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 hover:scale-105">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#6C4DE6] rounded-lg flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div className="hidden md:block">
                <h1 className="font-bold text-lg">Zil Connect</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-[#5C4DE8] text-white shadow-lg"
                          : "text-white/80 hover:bg-[#3C2F63] hover:text-white"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Invitations - Show on large screens */}
              <motion.div className="hidden lg:block" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to={createPageUrl("Invitations")}>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#3C2F63] relative transition-all duration-300">
                    <Users className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6C4DE6] text-white text-xs border-2 border-[#241C3A] pulse-glow">
                      3
                    </Badge>
                  </Button>
                </Link>
              </motion.div>

              {/* Messages - Show on large screens */}
              <motion.div className="hidden lg:block" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to={createPageUrl("Connected")}>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#3C2F63] relative transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6C4DE6] text-white text-xs border-2 border-[#241C3A] pulse-glow">
                      5
                    </Badge>
                  </Button>
                </Link>
              </motion.div>

              {/* Notifications - Show on large screens */}
              <motion.div className="hidden lg:block" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#3C2F63] relative transition-all duration-300">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#6C4DE6] text-white text-xs border-2 border-[#241C3A] pulse-glow">
                    8
                  </Badge>
                </Button>
              </motion.div>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="flex items-center gap-1.5 text-white hover:bg-[#3C2F63] transition-all duration-300 pl-2 pr-2 sm:pl-3 sm:pr-3">
                      <div className="w-8 h-8 bg-[#6C4DE6] rounded-full flex items-center justify-center font-semibold text-white text-sm">
                        {business?.business_name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </div>
                      <span className="hidden lg:block text-sm font-medium">
                        {business?.business_name || userName}
                      </span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")} className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Settings")} className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-[#FF4C4C] cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[#3C2F63]">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm bg-white p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6C4DE6] rounded-full flex items-center justify-center font-semibold text-white">
                        {business?.business_name?.[0]?.toUpperCase() || <User className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E1E1E]">{business?.business_name || userName}</p>
                        <p className="text-xs text-[#7C7C7C]">Premium Member</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <Link
                          key={item.title}
                          to={item.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-[#6C4DE6] text-white"
                              : "text-[#1E1E1E] hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-[#FF4C4C] hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="min-h-[calc(100vh-4rem)]"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Floating Action Button */}
      <DropdownMenu open={showCreateMenu} onOpenChange={setShowCreateMenu}>
        <DropdownMenuTrigger asChild>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-2xl bg-[#6C4DE6] hover:bg-[#593CC9] transition-all duration-300 pulse-glow"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer">
            <Briefcase className="w-4 h-4 mr-2" />
            Post Opportunity
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Tag className="w-4 h-4 mr-2" />
            Create Offer
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Calendar className="w-4 h-4 mr-2" />
            Host Event
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            Create Community
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


