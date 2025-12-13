import React, { useEffect } from 'react';
import Layout from "./Layout";
import Home from "./Home";
import Marketplace from "./Marketplace";
import Opportunities from "./Opportunities";
import Search from "./Search";
import Offers from "./Offers";
import Events from "./Events";
import Community from "./Community";
import Knowledge from "./Knowledge";
import Analytics from "./Analytics";
import Profile from "./Profile";
import Settings from "./Settings";
import Invitations from "./Invitations";
import Connected from "./Connected";
import BusinessDetails from "./BusinessDetails";
import OpportunityApply from "./OpportunityApply";
import CourseDetails from "./CourseDetails";
import ModuleLessons from "./ModuleLessons";
import OpportunityDetails from "./OpportunityDetails";
import AppliedOpportunities from "./AppliedOpportunities";
import CreateOpportunity from "./CreateOpportunity";
import MyOpportunities from "./MyOpportunities";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LoadingScreen from "../components/LoadingScreen";
import { pb } from "@/api/pocketbaseClient";

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
      </Routes>
    </Router>
  );
}

