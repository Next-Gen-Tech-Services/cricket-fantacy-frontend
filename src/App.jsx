import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import HowToEarnPoints from "./pages/HowToEarnPoints";

// New Tournament Flow Pages
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import MatchDetails from "./pages/MatchDetails";
import Leaderboard from "./pages/Leaderboard";

import Login from "./pages/login";
import Signup from "./pages/signup";
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
        </Route>

        {/* ===== MAIN ROUTES ===== */}
        <Route element={<MainLayout />}>
          {/* Public Routes - Available to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/how-to-earn-points" element={<HowToEarnPoints />} />
          
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
