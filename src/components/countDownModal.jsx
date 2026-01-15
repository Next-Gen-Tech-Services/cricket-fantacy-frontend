import { useEffect, useState } from "react";

export default function CountdownModal({ isOpen, onClose }) {
  const targetDate = new Date("2026-03-20T00:00:00"); // change date if needed
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
  <div className="relative w-[92%] max-w-lg rounded-3xl overflow-hidden shadow-2xl">

    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b0b] via-[#141414] to-[#1f1f1f]
" />
    <div className="absolute inset-0 bg-black/40" />

    {/* Content */}
    <div className="relative p-8 text-white">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-lg"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-green-400 leading-tight">
        Indian Premier League 2026
      </h2>

      <p className="mt-2 text-base text-white/90">
        The biggest cricket fantasy league is almost here!
      </p>

      <p className="mt-5 text-sm uppercase tracking-wide text-white/60">
        Countdown to Glory
      </p>

      {/* Countdown Cards */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/10 backdrop-blur-md py-4 shadow-inner"
          >
            <p className="text-4xl font-bold text-purple-400">
              {item.value ?? "--"}
            </p>
            <p className="mt-1 text-xs tracking-widest text-white/70">
              {item.label.toUpperCase()}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-white/20" />

      {/* Description */}
      <p className="text-sm text-white/80 leading-relaxed">
        Build your ultimate fantasy cricket team, compete with millions
        of fans, climb the leaderboard, and win exciting rewards.
      </p>

      {/* CTA Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-gray-200 transition"
        >
          Join the Action
        </button>

        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/40 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          Remind Me Later
        </button>
      </div>
    </div>
  </div>
</div>

  );
}
