import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TABS = ["All", "Mega", "Head to Head", "Winner Takes All", "Practice"];

const leaguesData = [
  {
    id: 1,
    type: "Mega",
    prizePool: 150000,
    entryFee: 49,
    totalSpots: 10000,
    joinedSpots: 7200,
    firstPrize: 50000,
    guaranteed: true,
  },
  {
    id: 2,
    type: "Head to Head",
    prizePool: 198,
    entryFee: 99,
    totalSpots: 2,
    joinedSpots: 1,
    firstPrize: 198,
    guaranteed: true,
  },
  {
    id: 3,
    type: "Winner Takes All",
    prizePool: 10000,
    entryFee: 199,
    totalSpots: 50,
    joinedSpots: 18,
    firstPrize: 10000,
    guaranteed: false,
  },
  {
    id: 4,
    type: "Practice",
    prizePool: 0,
    entryFee: 0,
    totalSpots: 100,
    joinedSpots: 40,
    firstPrize: 0,
    guaranteed: true,
  },
];

export default function Leagues() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? leaguesData
      : leaguesData.filter((l) => l.type === activeTab);

  return (
    <main
      className="px-4 py-10 space-y-10"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      {/* ================= MATCH HEADER ================= */}
      <section
        className="max-w-[1440px] mx-auto rounded-3xl p-8 text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--btn-primary), var(--btn-primary-hover))",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">India vs Australia</h1>
            <p className="opacity-90 mt-1 text-sm">
              ODI Match • Today • 7:30 PM IST
            </p>
          </div>

          <div className="flex gap-3 text-sm font-semibold">
            <div className="bg-white/20 px-4 py-1 rounded-full">
              ⏳ 02h 18m left
            </div>
            <div
              className="px-4 py-1 rounded-full bg-white"
              style={{ color: "var(--btn-primary)" }}
            >
              120+ Contests
            </div>
          </div>
        </div>
      </section>

      {/* ================= TABS ================= */}
      <section className="max-w-[1440px] mx-auto flex flex-wrap gap-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition"
            style={
              activeTab === tab
                ? {
                    backgroundColor: "var(--btn-primary)",
                    color: "#fff",
                  }
                : {
                    backgroundColor: "#fff",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }
            }
          >
            {tab}
          </button>
        ))}
      </section>

      {/* ================= LEAGUE GRID ================= */}
      <section className="max-w-[1440px] mx-auto grid gap-6 md:grid-cols-3">
        {filtered.map((l) => {
          const progress = (l.joinedSpots / l.totalSpots) * 100;
          const left = l.totalSpots - l.joinedSpots;
          const isFull = left === 0;

          return (
            <div
              key={l.id}
              className="rounded-2xl p-6 space-y-4 transition hover:shadow-lg"
              style={{
                backgroundColor: "#fff",
                border: "1px solid var(--border)",
              }}
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Prize Pool</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    ₹{l.prizePool.toLocaleString()}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: "var(--btn-primary)",
                      color: "#fff",
                    }}
                  >
                    {l.type}
                  </span>

                  <p className="text-sm text-[var(--text-secondary)]">
                    Entry ₹{l.entryFee}
                  </p>
                </div>
              </div>

              {/* PROGRESS */}
              <div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: isFull
                        ? "var(--btn-danger)"
                        : "var(--btn-success)",
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs mt-1 text-[var(--text-secondary)]">
                  <span>
                    {l.joinedSpots}/{l.totalSpots} joined
                  </span>
                  <span>{isFull ? "Contest Full" : `${left} spots left`}</span>
                </div>
              </div>

              {/* EXTRA INFO */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">
                  🏆 First Prize:{" "}
                  <strong className="text-[var(--text-primary)]">
                    ₹{l.firstPrize}
                  </strong>
                </span>

                {l.guaranteed && (
                  <span className="text-green-600 font-semibold text-xs">
                    Guaranteed
                  </span>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate("/matches")}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition"
                style={{
                  backgroundColor: "var(--btn-primary)",
                  color: "#fff",
                }}
              >
                View Contest
              </button>
            </div>
          );
        })}
      </section>
    </main>
  );
}
