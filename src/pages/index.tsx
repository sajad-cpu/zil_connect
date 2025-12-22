import { pb } from "@/api/pocketbaseClient";
import React, { useEffect } from 'react';
import LoadingScreen from "../components/LoadingScreen";
import AdminLogin from "./Admin/AdminLogin";
import AdminAnalytics from "./Admin/Analytics";
import AdminBusinesses from "./Admin/Businesses";
import AdminCommissions from "./Admin/Commissions";
import AdminDashboard from "./Admin/Dashboard";
import AdminEnrollments from "./Admin/Enrollments";
import AdminFintechProducts from "./Admin/FintechProducts";
import AdminMessages from "./Admin/Messages";
import AdminOffers from "./Admin/Offers";
import AdminOpportunities from "./Admin/Opportunities";
import AdminSettings from "./Admin/Settings";
import AdminUsers from "./Admin/Users";
import Analytics from "./Analytics";
import AppliedOpportunities from "./AppliedOpportunities";
import BusinessDetails from "./BusinessDetails";
import Community from "./Community";
import Connected from "./Connected";
import CourseDetails from "./CourseDetails";
import CreateOffer from "./CreateOffer";
import CreateOpportunity from "./CreateOpportunity";
import Events from "./Events";
import FintechMarketplace from "./FintechMarketplace";
import Home from "./Home";
import Invitations from "./Invitations";
import Knowledge from "./Knowledge";
import Layout from "./Layout";
import Marketplace from "./Marketplace";
import ModuleLessons from "./ModuleLessons";
import MyClaimedOffers from "./MyClaimedOffers";
import MyOffers from "./MyOffers";
import MyOpportunities from "./MyOpportunities";
import Offers from "./Offers";
import Opportunities from "./Opportunities";
import OpportunityApply from "./OpportunityApply";
import OpportunityDetails from "./OpportunityDetails";
import Profile from "./Profile";
import Search from "./Search";
import Settings from "./Settings";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';

const PAGES: Record<string, any> = {
  Home: Home,
  Marketplace: Marketplace,
  Opportunities: Opportunities,
  Search: Search,
  Offers: Offers,
  Events: Events,
  Community: Community,
  Knowledge: Knowledge,
  Analytics: Analytics,
  Profile: Profile,
  Settings: Settings,
  Invitations: Invitations,
  Connected: Connected,
  BusinessDetails: BusinessDetails,
  OpportunityApply: OpportunityApply,
  CourseDetails: CourseDetails,
  ModuleLessons: ModuleLessons,
  OpportunityDetails: OpportunityDetails,
  AppliedOpportunities: AppliedOpportunities,
  CreateOpportunity: CreateOpportunity,
  MyOpportunities: MyOpportunities,
  CreateOffer: CreateOffer,
  MyOffers: MyOffers,
  MyClaimedOffers: MyClaimedOffers,
  FintechMarketplace: FintechMarketplace,
  SignIn: SignIn,
  SignUp: SignUp,
}

function _getCurrentPage(url: string): string {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split('/').pop() || '';
  if (urlLastPart.includes('?')) {
    urlLastPart = urlLastPart.split('?')[0];
  }

  const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
  return pageName || Object.keys(PAGES)[0];
}

// Root redirect component - handles initial route
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated - must have both valid token AND user model
    if (pb.authStore.isValid && pb.authStore.model) {
      // User is logged in, redirect to Home
      navigate("/Home", { replace: true });
    } else {
      // User is not logged in, redirect to SignIn
      navigate("/SignIn", { replace: true });
    }
  }, [navigate]);

  // Show loading screen while redirecting
  return <LoadingScreen />;
}

// Wrapper component for pages WITH layout
function PageWithLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      {children}
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <Routes>
        {/* Root route - handles initial redirect based on auth state */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth routes - NO layout */}
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        {/* Regular routes - WITH layout */}
        <Route path="/Home" element={<PageWithLayout><Home /></PageWithLayout>} />
        <Route path="/Marketplace" element={<PageWithLayout><Marketplace /></PageWithLayout>} />
        <Route path="/Opportunities" element={<PageWithLayout><Opportunities /></PageWithLayout>} />
        <Route path="/Search" element={<PageWithLayout><Search /></PageWithLayout>} />
        <Route path="/Offers" element={<PageWithLayout><Offers /></PageWithLayout>} />
        <Route path="/Events" element={<PageWithLayout><Events /></PageWithLayout>} />
        <Route path="/Community" element={<PageWithLayout><Community /></PageWithLayout>} />
        <Route path="/Knowledge" element={<PageWithLayout><Knowledge /></PageWithLayout>} />
        <Route path="/Analytics" element={<PageWithLayout><Analytics /></PageWithLayout>} />
        <Route path="/Profile" element={<PageWithLayout><Profile /></PageWithLayout>} />
        <Route path="/Settings" element={<PageWithLayout><Settings /></PageWithLayout>} />
        <Route path="/Invitations" element={<PageWithLayout><Invitations /></PageWithLayout>} />
        <Route path="/Connected" element={<PageWithLayout><Connected /></PageWithLayout>} />
        <Route path="/BusinessDetails" element={<PageWithLayout><BusinessDetails /></PageWithLayout>} />
        <Route path="/OpportunityApply" element={<PageWithLayout><OpportunityApply /></PageWithLayout>} />
        <Route path="/CourseDetails" element={<PageWithLayout><CourseDetails /></PageWithLayout>} />
        <Route path="/ModuleLessons" element={<PageWithLayout><ModuleLessons /></PageWithLayout>} />
        <Route path="/OpportunityDetails" element={<PageWithLayout><OpportunityDetails /></PageWithLayout>} />
        <Route path="/AppliedOpportunities" element={<PageWithLayout><AppliedOpportunities /></PageWithLayout>} />
        <Route path="/CreateOpportunity" element={<PageWithLayout><CreateOpportunity /></PageWithLayout>} />
        <Route path="/MyOpportunities" element={<PageWithLayout><MyOpportunities /></PageWithLayout>} />
        <Route path="/CreateOffer" element={<PageWithLayout><CreateOffer /></PageWithLayout>} />
        <Route path="/MyOffers" element={<PageWithLayout><MyOffers /></PageWithLayout>} />
        <Route path="/MyClaimedOffers" element={<PageWithLayout><MyClaimedOffers /></PageWithLayout>} />
        <Route path="/FintechMarketplace" element={<PageWithLayout><FintechMarketplace /></PageWithLayout>} />

        {/* Admin routes - NO regular layout, uses AdminLayout */}
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/allusers" element={<AdminUsers />} />
        <Route path="/AdminBusinesses" element={<AdminBusinesses />} />
        <Route path="/AdminOpportunities" element={<AdminOpportunities />} />
        <Route path="/AdminOffers" element={<AdminOffers />} />
        <Route path="/AdminMessages" element={<AdminMessages />} />
        <Route path="/AdminFintechProducts" element={<AdminFintechProducts />} />
        <Route path="/AdminEnrollments" element={<AdminEnrollments />} />
        <Route path="/AdminCommissions" element={<AdminCommissions />} />
        <Route path="/AdminAnalytics" element={<AdminAnalytics />} />
        <Route path="/AdminSettings" element={<AdminSettings />} />
      </Routes>
    </Router>
  );
}

