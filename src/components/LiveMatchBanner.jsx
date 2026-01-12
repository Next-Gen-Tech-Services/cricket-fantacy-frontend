import { Link } from "react-router-dom";

export default function LiveMatchBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-[var(--btn-primary)] text-white">
      {/* Gradient edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[var(--btn-primary)] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[var(--btn-primary)] to-transparent z-10" />

      {/* Moving content */}
      <div className="whitespace-nowrap flex items-center gap-12 animate-marquee hover:[animation-play-state:paused] py-2">
        {/* Repeat content for smooth loop */}
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="font-semibold tracking-wide">
              🔴 LIVE: India vs Australia • ODI • Today 7:30 PM IST
            </span>

            <span className="opacity-90">
              Prize Pool ₹1,50,000 • Mega Contest Available
            </span>

            <Link
              to="/matches"
              className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition"
            >
              View Match
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
