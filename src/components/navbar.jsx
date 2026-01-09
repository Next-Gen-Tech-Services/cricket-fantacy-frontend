import { useState } from "react"
import { GiCricketBat } from "react-icons/gi"
import { Link } from "react-router-dom"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { name: "Home", href: "#" },
        { name: "Leagues", href: "#" },
        { name: "Teams", href: "#" },
        { name: "Matches", href: "#" },
    ]

    return (
        <header className="sticky top-0 z-50">
            <nav
                className="
          backdrop-blur-lg
          bg-[rgb(var(--color-bg)/0.75)]
          border-b border-white/10
        "
            >
                <div className="max-w-[1440px] mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">

                        {/* ================= LOGO ================= */}
                       <Link to={'/'} >
                        <div className="flex items-center gap-2">
                            <div
                                className="
      h-9 w-9 rounded-lg
      bg-gradient-to-br
      from-[rgb(var(--color-primary))]
      to-[rgb(var(--color-secondary))]
      flex items-center justify-center
      text-black
    "
                            >
                                <GiCricketBat size={20} />
                            </div>

                            <span className="text-lg font-bold text-[rgb(var(--color-text))]">
                                CricLeague
                            </span>
                        </div></Link>


                        {/* ================= DESKTOP LINKS ================= */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="
                    text-sm font-medium
                    text-[rgb(var(--color-text)/0.8)]
                    hover:text-[rgb(var(--color-text))]
                    transition
                  "
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* ================= RIGHT ACTION ================= */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link to={'/create-team'} >
                            <button
                                className="
                  px-4 py-2 rounded-xl text-sm font-semibold
                  bg-gradient-to-r
                  from-[rgb(var(--color-primary))]
                  to-[rgb(var(--color-secondary))]
                  text-white
                  hover:opacity-90
                  transition cursor-pointer
                "
                            >
                                + Create Team
                            </button></Link>
                        </div>

                        {/* ================= MOBILE MENU BUTTON ================= */}
                        <button
                            className="md:hidden text-[rgb(var(--color-text))]"
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
                        <div
                            className="
                rounded-2xl p-4 mt-2
                bg-[rgb(var(--color-surface))]
                border border-white/10
                space-y-3
              "
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="
                    block text-sm font-medium
                    text-[rgb(var(--color-text)/0.9)]
                  "
                                >
                                    {link.name}
                                </a>
                            ))}

                           <Link to={'/create-team'} >
                            <button
                                className="
                  w-full mt-2 px-4 py-2 rounded-xl text-sm font-semibold
                  bg-gradient-to-r
                  from-[rgb(var(--color-primary))]
                  to-[rgb(var(--color-secondary))]
                  text-black
                "
                            >
                                + Create Team
                            </button></Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
