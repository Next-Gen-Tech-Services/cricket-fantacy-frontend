export default function Footer() {
  const footerLinks = [
    {
      title: "Premier League",
      links: ["Premier League", "Fantasy", "Matches"],
    },
    {
      title: "Explore",
      links: ["Table", "Statistics", "Latest News"],
    },
    {
      title: "More",
      links: ["Latest Video", "Clubs", "Players"],
    },
  ];

  const bottomLinks = [
    "Modern Slavery Statement",
    "Equality, Diversity and Inclusion Standard",
    "Terms of Use",
    "Policies",
    "Cookie Policy",
    "Contact Us",
    "Appearance",
    "Back To Top",
  ];

  return (
    <footer className="mt-16 bg-[#273470] border-t border-[#1e2859]">
      <div className="max-w-[1440px] mx-auto px-4 py-14">
        {/* ================= TOP LINKS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-white mb-5 tracking-wide">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="
                        text-sm text-gray-300
                        hover:text-yellow-400
                        transition-colors duration-200
                      "
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="my-12 border-t border-[#1e2859]" />

        {/* ================= BOTTOM BAR ================= */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-gray-400">
            © 2026 CricLeague. All rights reserved.
          </p>

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
