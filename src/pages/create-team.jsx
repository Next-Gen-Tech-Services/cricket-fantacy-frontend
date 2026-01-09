import { useState } from "react"
import { FiPlus, FiX } from "react-icons/fi"
import groundBg from '../assets/ground-bg.jpeg'

/* ------------------ CONFIG ------------------ */
const TEAM_RULES = {
  WK: { min: 1, max: 1 },
  BAT: { min: 3, max: 5 },
  AR: { min: 3, max: 4 },
  BOWL: { min: 3, max: 5 },
  TOTAL: 11,
  BUDGET: 100,
}

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
]

/* ------------------ HELPERS ------------------ */
const roleLabel = {
  WK: "Wicket Keeper",
  BAT: "Batsman",
  AR: "All-Rounder",
  BOWL: "Bowler",
}

export default function CreateTeam() {
  const [selected, setSelected] = useState([])

  const totalCredits = selected.reduce((a, b) => a + b.price, 0)

  const countByRole = (role) =>
    selected.filter((p) => p.role === role).length

  const canAdd = (player) => {
    if (selected.length >= TEAM_RULES.TOTAL) return false
    if (totalCredits + player.price > TEAM_RULES.BUDGET) return false
    if (countByRole(player.role) >= TEAM_RULES[player.role].max) return false
    return true
  }

  const togglePlayer = (player) => {
    if (selected.find((p) => p.id === player.id)) {
      setSelected(selected.filter((p) => p.id !== player.id))
    } else {
      if (!canAdd(player)) return
      setSelected([...selected, player])
    }
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-8 grid lg:grid-cols-[380px_1fr] gap-8">
      {/* ================= LEFT : PLAYER LIST ================= */}
      <section className="bg-[rgb(var(--color-surface))] rounded-3xl p-5 border border-white/10">
        <h2 className="text-2xl font-bold text-white">Player Selection</h2>
        <p className="text-sm text-[rgb(var(--color-text)/0.7)] mt-1">
          Pick players within credit & role limits
        </p>

        <div className="mt-4 space-y-6">
          {["WK", "BAT", "AR", "BOWL"].map((role) => (
            <div key={role}>
              <h3 className="text-lg font-semibold text-white mb-2">
                {roleLabel[role]}
              </h3>

              <div className="space-y-2">
                {players
                  .filter((p) => p.role === role)
                  .map((player) => {
                    const isSelected = selected.some(
                      (p) => p.id === player.id
                    )

                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {player.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {player.team} · {player.price} cr
                          </p>
                        </div>

                        <button
                          onClick={() => togglePlayer(player)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center
                            ${
                              isSelected
                                ? "bg-red-500"
                                : "bg-[rgb(var(--color-primary))]"
                            }
                          `}
                        >
                          {isSelected ? <FiX /> : <FiPlus />}
                        </button>
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RIGHT : PITCH VIEW ================= */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-green-700 to-green-900 p-6">
        {/* Top Stats */}
        <div className="flex flex-wrap gap-4 justify-between mb-4">
          <div className="text-white font-semibold">
            Players: {selected.length}/{TEAM_RULES.TOTAL}
          </div>

          <div className="bg-white text-black px-4 py-1 rounded-full font-bold">
            {TEAM_RULES.BUDGET - totalCredits} cr left
          </div>
        </div>

        {/* Pitch */}
        <div className="grid grid-rows-4 gap-6 text-center text-white">
          {/* WK */}
          <PitchRow
            title="Wicket Keeper"
            players={selected.filter((p) => p.role === "WK")}
          />

          {/* BAT */}
          <PitchRow
            title="Batsmen"
            players={selected.filter((p) => p.role === "BAT")}
          />

          {/* AR */}
          <PitchRow
            title="All-Rounders"
            players={selected.filter((p) => p.role === "AR")}
          />

          {/* BOWL */}
          <PitchRow
            title="Bowlers"
            players={selected.filter((p) => p.role === "BOWL")}
          />
        </div>
      </section>
    </main>
  )
}

/* ------------------ SUB COMPONENT ------------------ */
function PitchRow({ title, players }) {
  return (
    <div>
      <p className="mb-2 text-sm opacity-80">{title}</p>
      <div className="flex justify-center gap-3 flex-wrap">
        {players.length === 0 ? (
          <div className="w-30 h-30 bg-white/20 rounded-xl flex items-center justify-center">
            +
          </div>
        ) : (
          players.map((p) => (
            <div
              key={p.id}
              className="w-30 h-30 bg-green-900 rounded-xl flex flex-col items-center justify-center"
            >
              <span className="text-xs font-bold">{p.name}</span>
              <span className="text-[10px] opacity-70">{p.team}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
