import { Routes, Route } from "react-router-dom"

import Home from "../pages/home"
import Login from "../pages/login"
import Signup from "../pages/signup"
import CreateTeam from "../pages/create-team"
import Table from "../pages/table"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/table" element={<Table />} />
        <Route path="/create-team" element={<CreateTeam />} />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-white">
              Page Not Found
            </div>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}
