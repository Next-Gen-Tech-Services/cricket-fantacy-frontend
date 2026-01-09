import { FiFilter, FiRotateCcw } from "react-icons/fi"

const tableData = [
    {
        pos: 1,
        team: "Arsenal",
        logo: "/logos/arsenal.png",
        played: 21,
        win: 15,
        draw: 4,
        loss: 2,
        gf: 40,
        ga: 14,
        gd: 26,
        pts: 49,
        form: ["W", "W", "W", "W", "D"],
        next: "/logos/nottingham.png",
    },
    {
        pos: 2,
        team: "Manchester City",
        logo: "/logos/mancity.png",
        played: 21,
        win: 13,
        draw: 4,
        loss: 4,
        gf: 45,
        ga: 19,
        gd: 26,
        pts: 43,
        form: ["W", "W", "D", "D", "D"],
        next: "/logos/manutd.png",
    },
    {
        pos: 3,
        team: "Aston Villa",
        logo: "/logos/astonvilla.png",
        played: 21,
        win: 13,
        draw: 4,
        loss: 4,
        gf: 33,
        ga: 24,
        gd: 9,
        pts: 43,
        form: ["W", "W", "L", "W", "D"],
        next: "/logos/everton.png",
    },
]

export default function Table() {
    return (
        <main className="max-w-[1440px] mx-auto px-4 mt-4 space-y-10">
            {/* ================= HEADER ================= */}
            <section className="rounded-3xl overflow-hidden bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))]">
                <div className="bg-black/30 px-6 py-14">
                    <h1 className="text-4xl font-bold text-white">Table</h1>
                </div>
            </section>

            {/* ================= FILTER BAR ================= */}
            <section className="max-w-[1440px] mx-auto px-4">
                <div className="flex flex-wrap items-center gap-3">
                    <button className="p-3 rounded-xl bg-[rgb(var(--color-surface))] border border-white/10 text-white">
                        <FiFilter />
                    </button>

                    {["Premier League", "2025/26", "All Matchweeks", "Home & Away"].map(
                        (item) => (
                            <select
                                key={item}
                                className="px-4 py-2 rounded-xl bg-[rgb(var(--color-surface))] border border-white/10 text-[rgb(var(--color-text))]"
                            >
                                <option>{item}</option>
                            </select>
                        )
                    )}

                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-[rgb(var(--color-text)/0.7)] hover:text-white">
                        <FiRotateCcw /> Reset
                    </button>
                </div>
            </section>

            {/* ================= TABLE ================= */}
            <section className="max-w-[1440px] mx-auto px-4">
                <div className="overflow-x-auto rounded-2xl bg-[rgb(var(--color-surface))] border border-white/10">
                    <table className="min-w-[1000px] w-full text-sm">
                        <thead className="bg-black/30 text-[rgb(var(--color-text)/0.8)]">
                            <tr>
                                <th className="px-4 py-3 text-left">Pos</th>
                                <th className="px-4 py-3 text-left">Team</th>
                                <th className="px-4 py-3">Pl</th>
                                <th className="px-4 py-3">W</th>
                                <th className="px-4 py-3">D</th>
                                <th className="px-4 py-3">L</th>
                                <th className="px-4 py-3">GF</th>
                                <th className="px-4 py-3">GA</th>
                                <th className="px-4 py-3">GD</th>
                                <th className="px-4 py-3">Pts</th>
                                <th className="px-4 py-3">Form</th>
                                <th className="px-4 py-3">Next</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tableData.map((row) => (
                                <tr
                                    key={row.pos}
                                    className="border-t border-white/5 hover:bg-white/5 transition"
                                >
                                    <td className="px-4 py-4 font-bold">{row.pos}</td>

                                    <td className="px-4 py-4 flex items-center gap-3">
                                        <img
                                            src={row.logo}
                                            alt={row.team}
                                            className="w-7 h-7"
                                        />
                                        <span className="font-semibold text-white">
                                            {row.team}
                                        </span>
                                    </td>

                                    <td className="text-center text-white">{row.played}</td>
                                    <td className="text-center text-white">{row.win}</td>
                                    <td className="text-center text-white">{row.draw}</td>
                                    <td className="text-center text-white">{row.loss}</td>
                                    <td className="text-center text-white">{row.gf}</td>
                                    <td className="text-center text-white">{row.ga}</td>
                                    <td className="text-center text-white">{row.gd}</td>

                                    <td className="text-center font-bold text-white">
                                        {row.pts}
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex gap-1">
                                            {row.form.map((f, i) => (
                                                <span
                                                    key={i}
                                                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold
                            ${f === "W"
                                                            ? "bg-green-500"
                                                            : f === "D"
                                                                ? "bg-gray-400 text-black"
                                                                : "bg-red-500"
                                                        }
                          `}
                                                >
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <img
                                            src={row.next}
                                            alt="Next"
                                            className="w-7 h-7 mx-auto"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}
