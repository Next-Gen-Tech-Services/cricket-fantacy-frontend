import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

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
          <Route path="/" element={<Home />} />
          <Route path="/how-to-earn-points" element={<HowToEarnPoints />} />
          
          {/* New Tournament Flow */}
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:tournamentId" element={<TournamentDetails />} />
          <Route path="/tournaments/:tournamentId/matches/:matchId" element={<MatchDetails />} />
          <Route path="/tournaments/:tournamentId/matches/:matchId/create-team" element={<CreateTeam />} />
          <Route path="/tournaments/:tournamentId/matches/:matchId/leaderboard" element={<Leaderboard />} />
          
          {/* Legacy Routes (kept for backward compatibility) */}
          <Route path="/matches" element={<Matches />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path='/table' element={<Table/>}/>
          
          {/* Protected Routes */}
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
