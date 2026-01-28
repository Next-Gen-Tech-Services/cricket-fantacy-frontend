import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import logo from "../assets/logo.svg";
import logo1 from "../assets/logo.webp";

export default function Footer() {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const navLinks = [
    { name: "Home", href: "/", authRequired: false },
    { name: "How to earn points", href: "/how-to-earn-points", authRequired: false },
    { name: "Tournaments", href: "/tournaments", authRequired: true },
    { name: "My Leagues", href: "/leagues", authRequired: true },
  ];

  const footerLinks = [
    {
      title: "Navigation",
      links: navLinks.map(link => ({
        name: link.name,
        href: link.href,
        authRequired: link.authRequired
      }))
    },
    {
      title: "Account",
      links: isAuthenticated ? [
        { name: "Profile", href: "/profile", authRequired: true },
        { name: "Settings", href: "/settings", authRequired: true },
        { name: "My Teams", href: "/teams", authRequired: true },
      ] : [
        { name: "Sign Up", href: "/signup", authRequired: false },
        { name: "Log In", href: "/login", authRequired: false },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "#", authRequired: false },
        { name: "Help Center", href: "#", authRequired: false },
        { name: "Terms of Use", href: "#", authRequired: false },
      ]
    },
  ];

  const bottomLinks = [
    "Privacy Policy",
    "Terms of Use", 
    "Cookie Policy",
    "Contact Us",
  ];

  return (
    <footer className="mt-16 bg-[#273470] border-t border-[#1e2859]">
      <div className="max-w-[1440px] mx-auto px-4 py-4">
        {/* ================= LOGO SECTION ================= */}
        <div className="mb-12">
          <Link to="/" className="flex items-center gap-2 mb-4">


            <img
              src={logo}
              alt="Cricket Lovers Global"
              className="h-12 mt-5 w-auto object-contain"
            />
            
          </Link>
          <p className="text-sm text-gray-300 max-w-md">
            Cricket Lovers Global - Create your fantasy cricket team and compete with friends. Passion Beyond Boundaries!
          </p>
        </div>

        {/* ================= TOP LINKS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-white mb-5 tracking-wide">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links
                  .filter(link => !link.authRequired || isAuthenticated)
                  .map((link, idx) => (
                  <li key={idx}>
                    {link.href?.startsWith('/') ? (
                      <NavLink
                        to={link.href}
                        className={({ isActive }) =>
                          `text-sm transition-colors duration-200 ${
                            isActive 
                              ? "text-yellow-400" 
                              : "text-gray-300 hover:text-yellow-400"
                          } ${link.authRequired && !isAuthenticated ? 'opacity-75' : ''}`
                        }
                      >
                        {link.name}
                        {link.authRequired && !isAuthenticated && (
                          <span className="text-xs text-yellow-400 ml-1">*</span>
                        )}
                      </NavLink>
                    ) : (
                      <a
                        href={link.href || "#"}
                        className="
                          text-sm text-gray-300
                          hover:text-yellow-400
                          transition-colors duration-200
                        "
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="mt-10 border-t border-[#1e2859]" />

        {/* ================= BOTTOM BAR ================= */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-gray-400">
            © 2026 Cricket Lovers Global. All rights reserved.
          </p>
                      <img
              src={logo1}
              alt="Cricket Lovers Global"
              className="h-20 w-auto object-contain ml-2"
            />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {bottomLinks.map((item, index) => (
              <a
                key={index}
                href="#"
                className="
                  text-gray-400
                  hover:text-white
                  transition-colors duration-200
                "
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
