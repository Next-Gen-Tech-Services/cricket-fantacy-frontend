import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

/* ------------------ CONFIG ------------------ */
const TEAM_RULES = {
  WK: { min: 1, max: 1 },
  BAT: { min: 3, max: 5 },
  AR: { min: 3, max: 4 },
  BOWL: { min: 3, max: 5 },
  TOTAL: 11,
  BUDGET: 100,
};

/* ------------------ SAMPLE DATA ------------------ */
const players = [
  { id: 1, name: "Rohit Sharma", role: "BAT", team: "IND", price: 9.0 },
  { id: 2, name: "Virat Kohli", role: "BAT", team: "IND", price: 9.5 },
  { id: 3, name: "KL Rahul", role: "WK", team: "IND", price: 8.5 },
  { id: 4, name: "Hardik Pandya", role: "AR", team: "IND", price: 9.0 },
  { id: 5, name: "Jadeja", role: "AR", team: "IND", price: 8.5 },
  { id: 6, name: "Bumrah", role: "BOWL", team: "IND", price: 8.5 },
  { id: 7, name: "Shami", role: "BOWL", team: "IND", price: 8.0 },
  { id: 8, name: "Warner", role: "BAT", team: "AUS", price: 9.0 },
  { id: 9, name: "Maxwell", role: "AR", team: "AUS", price: 8.5 },
  { id: 10, name: "Starc", role: "BOWL", team: "AUS", price: 8.5 },
];

const roleLabel = {
  WK: "Wicket Keeper",
  BAT: "Batsman",
  AR: "All-Rounder",
  BOWL: "Bowler",
};

export default function CreateTeam() {
  const [selected, setSelected] = useState([]);

  const totalCredits = selected.reduce((a, b) => a + b.price, 0);

  const countByRole = (role) =>
    selected.filter((p) => p.role === role).length;

  const canAdd = (player) => {
    if (selected.length >= TEAM_RULES.TOTAL) return false;
    if (totalCredits + player.price > TEAM_RULES.BUDGET) return false;
    if (countByRole(player.role) >= TEAM_RULES[player.role].max)
      return false;
    return true;
  };

  const togglePlayer = (player) => {
    if (selected.find((p) => p.id === player.id)) {
      setSelected(selected.filter((p) => p.id !== player.id));
    } else {
      if (!canAdd(player)) return;
      setSelected([...selected, player]);
    }
  };

  return (
    <main className="bg-main">
      <div className="max-w-[1440px] mx-auto px-4 py-10 grid lg:grid-cols-[380px_1fr] gap-8">
        {/* ================= LEFT : PLAYER LIST ================= */}
        <section className="app-card p-5">
          <h2 className="text-2xl font-bold text-primary">
            Player Selection
          </h2>
          <p className="text-sm text-secondary mt-1">
            Pick players within credit & role limits
          </p>

          <div className="mt-6 space-y-6">
            {["WK", "BAT", "AR", "BOWL"].map((role) => (
              <div key={role}>
                <h3 className="text-sm font-semibold text-secondary mb-2">
                  {roleLabel[role]}
                </h3>

                <div className="space-y-2">
                  {players
                    .filter((p) => p.role === role)
                    .map((player) => {
                      const isSelected = selected.some(
                        (p) => p.id === player.id
                      );

                      return (
                        <div
                          key={player.id}
                          className="flex items-center justify-between rounded-xl px-3 py-2 border border-[var(--border)] bg-white"
                        >
                          <div>
                            <p className="text-sm font-medium text-primary">
                              {player.name}
                            </p>
                            <p className="text-xs text-muted">
                              {player.team} · {player.price} cr
                            </p>
                          </div>

                          <button
                            onClick={() => togglePlayer(player)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition
                              ${
                                isSelected
                                  ? "bg-[var(--btn-danger)] hover:bg-[var(--btn-danger-hover)]"
                                  : "bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)]"
                              }`}
                          >
                            {isSelected ? <FiX /> : <FiPlus />}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= RIGHT : PITCH VIEW ================= */}
        <section className="rounded-3xl p-6 text-white"
          style={{
            background:
              "linear-gradient(180deg, #15803d, #14532d)",
          }}
        >
          {/* TOP STATS */}
          <div className="flex justify-between items-center mb-6">
            <p className="font-semibold">
              Players: {selected.length}/{TEAM_RULES.TOTAL}
            </p>
            <span className="bg-white text-primary px-4 py-1 rounded-full font-bold">
              {TEAM_RULES.BUDGET - totalCredits} cr left
            </span>
          </div>

          {/* PITCH */}
          <div className="grid grid-rows-4 gap-6 text-center">
            <PitchRow
              title="Wicket Keeper"
              players={selected.filter((p) => p.role === "WK")}
            />
            <PitchRow
              title="Batsmen"
              players={selected.filter((p) => p.role === "BAT")}
            />
            <PitchRow
              title="All-Rounders"
              players={selected.filter((p) => p.role === "AR")}
            />
            <PitchRow
              title="Bowlers"
              players={selected.filter((p) => p.role === "BOWL")}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ------------------ SUB COMPONENT ------------------ */
function PitchRow({ title, players }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase opacity-80">
        {title}
      </p>

      <div className="flex justify-center gap-3 flex-wrap">
        {players.length === 0 ? (
          <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold">
            +
          </div>
        ) : (
          players.map((p) => (
            <div
              key={p.id}
              className="w-20 h-20 bg-green-900/80 rounded-xl flex flex-col items-center justify-center"
            >
              <span className="text-xs font-semibold text-center px-1">
                {p.name}
              </span>
              <span className="text-[10px] opacity-80">
                {p.team}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
