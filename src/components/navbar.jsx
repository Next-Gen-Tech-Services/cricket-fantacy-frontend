import { useState } from "react";
import { GiCricketBat } from "react-icons/gi";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo.webp"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Leagues", href: "/leagues" },
    { name: "Teams", href: "/teams" },
    { name: "Matches", href: "/matches" },
    { name: "Table", href: "/table" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="CricLeague Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>


            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition ${isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* RIGHT ACTIONS (IMPROVED) */}
            <div className="hidden md:flex items-center gap-5">
              {/* Login - text */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-slat-600 text-black/70 hover:text-black  transition"
              >
                Login
              </Link>

              {/* Sign up - primary */}
              <Link to="/signup">
                <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
                  Sign up
                </button>
              </Link>

            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden text-slate-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="rounded-2xl p-4 mt-2 bg-white border border-slate-200 shadow-sm space-y-4">
              {/* NAV LINKS */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium ${isActive ? "text-blue-600" : "text-slate-700"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="h-px bg-slate-200" />

              {/* AUTH + CTA */}
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700">
                  Login
                </button>
              </Link>

              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white">
                  Sign up
                </button>
              </Link>


            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
