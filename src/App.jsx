import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SplashScreen from "./components/SplashScreen";

import Home from "./pages/home";
import Matches from "./pages/Matches";
import Leagues from "./pages/Leagues";
import Teams from "./pages/Teams";
import CreateTeam from "./pages/CreateTeam";
import Table from "./pages/table";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Vault from "./components/Vault";
import HowToEarnPoints from "./pages/HowToEarnPoints";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Cookies from "./pages/Cookies";
import MobileLogout from "./pages/MobileLogout";
import MyMatches from "./pages/MyMatches";
import MyLeagues from "./pages/MyLeagues";

// New Tournament Flow Pages
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import MatchDetails from "./pages/MatchDetails";
import Leaderboard from "./pages/Leaderboard";
import LeagueDetails from "./pages/LeagueDetails";
import JoinLeagueByCode from "./pages/JoinLeagueByCode";

import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={7000} />;
  }

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />

      <Routes>
        {/* ===== AUTH ROUTES ===== */}
        <Route element={<AuthLayout />}>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password/:token" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
        </Route>

        {/* ===== MAIN ROUTES ===== */}
        <Route element={<MainLayout />}>
          {/* Public Routes - Available to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/how-to-earn-points" element={<HowToEarnPoints />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route 
            path="/mobile-logout" 
            element={
              <ProtectedRoute>
                <MobileLogout />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Tournament Flow - Require Authentication */}
          <Route 
            path="/tournaments" 
            element={
              <ProtectedRoute>
                <Tournaments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tournaments/:tournamentId" 
            element={
              <ProtectedRoute>
                <TournamentDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tournaments/:tournamentId/matches/:matchId" 
            element={
              <ProtectedRoute>
                <MatchDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tournaments/:tournamentId/matches/:matchId/create-team" 
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tournaments/:tournamentId/matches/:matchId/edit-team/:teamId" 
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tournaments/:tournamentId/matches/:matchId/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          
          {/* League Routes */}
          <Route 
            path="/leagues/:leagueId" 
            element={
              <ProtectedRoute>
                <LeagueDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leagues/join/:shareCode" 
            element={
              <ProtectedRoute>
                <JoinLeagueByCode />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Legacy Routes - Require Authentication */}
          <Route 
            path="/matches" 
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leagues" 
            element={
              <ProtectedRoute>
                <Leagues />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-matches" 
            element={
              <ProtectedRoute>
                <MyMatches />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-leagues" 
            element={
              <ProtectedRoute>
                <MyLeagues />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teams" 
            element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-team" 
            element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/table' 
            element={
              <ProtectedRoute>
                <Table />
              </ProtectedRoute>
            }
          />
          
          {/* User Profile & Settings - Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vault" 
            element={
              <ProtectedRoute>
                <Vault />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* ===== 404 ===== */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              404 Page Not Found
            </div>
          }
        />
      </Routes>
    </>
  );
}
