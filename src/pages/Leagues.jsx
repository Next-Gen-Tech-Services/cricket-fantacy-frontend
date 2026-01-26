import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAward, FiSearch, FiFilter } from "react-icons/fi";

const TABS = ["All", "Upcoming", "Live", "Completed"];

const leaguesData = [
  
];

export default function Leagues() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered =
    activeTab === "All"
      ? leaguesData
      : leaguesData.filter((l) => l.type === activeTab);

  return (
    <main
      className="px-4 py-10 space-y-10"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      {/* ================= HEADER SECTION ================= */}
      <section className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left: Title and Description */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <FiAward className="text-slate-600 mr-3" size={40} />
              <h1 className="text-4xl font-bold text-slate-800">
                Cricket Tournaments
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              Join the ultimate fantasy cricket experience. Pick your tournament, select your team, and compete for glory!
            </p>
          </div>

          {/* Right: Search and Filter */}
          <div className="flex items-center gap-4 lg:min-w-[400px]">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-4 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
            >
              <FiFilter size={20} />
            </button>
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

      {/* Filter Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Filter */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Status</p>
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                setActiveTab("All");
                setSearchQuery("");
              }}
              className="w-full px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </main>
  );
}
