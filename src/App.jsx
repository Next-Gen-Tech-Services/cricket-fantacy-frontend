import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";

import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Leagues from "./pages/Leagues";
import Teams from "./pages/Teams";
import CreateTeam from "./pages/CreateTeam";
import Table from "./pages/Table";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ===== AUTH ROUTES ===== */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* ===== MAIN ROUTES ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path='/table' element={<Table/>}/>
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
