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
  ]

  const bottomLinks = [
    "Modern Slavery Statement",
    "Equality, Diversity and Inclusion Standard",
    "Terms of Use",
    "Policies",
    "Cookie Policy",
    "Contact Us",
    "Appearance",
    "Back To Top",
  ]

  return (
    <footer className="mt-6 bg-[rgb(var(--color-bg))] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 py-14">
        
        {/* ================= TOP LINKS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-[rgb(var(--color-text))] mb-4">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="
                        text-sm
                        text-[rgb(var(--color-text)/0.75)]
                        hover:text-[rgb(var(--color-text))]
                        transition
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
        <div className="my-10 border-t border-white/10" />

        {/* ================= BOTTOM BAR ================= */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <p className="text-xs text-[rgb(var(--color-text)/0.6)]">
            © Premier League 2026
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {bottomLinks.map((item, index) => (
              <a
                key={index}
                href="#"
                className="
                  text-[rgb(var(--color-text)/0.6)]
                  hover:text-[rgb(var(--color-text))]
                  transition
                "
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
