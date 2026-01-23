import { FiFilter, FiRotateCcw } from "react-icons/fi";

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
];

export default function Table() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 mt-6 space-y-10">
      {/* ================= HEADER ================= */}
      <section className="rounded-3xl overflow-hidden bg-[#273470]">
        <div className="px-6 py-14">
          <h1 className="text-4xl font-bold text-white">League Table</h1>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section>
        <div className="flex flex-wrap items-center gap-3">
          <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
            <FiFilter />
          </button>

          {[
            "Premier League",
            "2025/26",
            "All Matchweeks",
            "Home & Away",
          ].map((item) => (
            <select
              key={item}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#273470]"
            >
              <option>{item}</option>
            </select>
          ))}

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
            <FiRotateCcw /> Reset
          </button>
        </div>
      </section>

      {/* ================= TABLE ================= */}
      <section>
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Pos</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-center">Pl</th>
                <th className="px-4 py-3 text-center">W</th>
                <th className="px-4 py-3 text-center">D</th>
                <th className="px-4 py-3 text-center">L</th>
                <th className="px-4 py-3 text-center">GF</th>
                <th className="px-4 py-3 text-center">GA</th>
                <th className="px-4 py-3 text-center">GD</th>
                <th className="px-4 py-3 text-center">Pts</th>
                <th className="px-4 py-3 text-center">Form</th>
                <th className="px-4 py-3 text-center">Next</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((row) => (
                <tr
                  key={row.pos}
                  className="border-t border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-4 font-bold text-slate-900">
                    {row.pos}
                  </td>

                  <td className="px-4 py-4 flex items-center gap-3">
                    <img
                      src={row.logo}
                      alt={row.team}
                      className="w-7 h-7"
                    />
                    <span className="font-semibold text-slate-900">
                      {row.team}
                    </span>
                  </td>

                  <td className="text-center text-slate-700">
                    {row.played}
                  </td>
                  <td className="text-center text-slate-700">
                    {row.win}
                  </td>
                  <td className="text-center text-slate-700">
                    {row.draw}
                  </td>
                  <td className="text-center text-slate-700">
                    {row.loss}
                  </td>
                  <td className="text-center text-slate-700">
                    {row.gf}
                  </td>
                  <td className="text-center text-slate-700">
                    {row.ga}
                  </td>
                  <td className="text-center text-slate-700">
                    {row.gd}
                  </td>

                  <td className="text-center font-bold text-slate-900">
                    {row.pts}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      {row.form.map((f, i) => (
                        <span
                          key={i}
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold text-white
                            ${
                              f === "W"
                                ? "bg-green-500"
                                : f === "D"
                                ? "bg-slate-400"
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
  );
}
