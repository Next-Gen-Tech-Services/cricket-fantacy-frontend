import { useNavigate } from "react-router-dom";

const teamsData = [
  {
    id: 1,
    name: "Team 1",
    players: 11,
    creditsUsed: 96.5,
    captain: "Virat Kohli",
    viceCaptain: "Hardik Pandya",
  },
  {
    id: 2,
    name: "Team 2",
    players: 11,
    creditsUsed: 98,
    captain: "Rohit Sharma",
    viceCaptain: "Jasprit Bumrah",
  },
];

export default function Teams() {
  const navigate = useNavigate();

  return (
    <main className="px-4 py-10 space-y-10 bg-main">
      {/* ================= HEADER ================= */}
      <section className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Teams</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your fantasy teams for upcoming matches
          </p>
        </div>
        <button
          onClick={() => navigate("/create-team")}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          + Create Team
        </button>
      </section>

      {/* ================= TEAMS GRID ================= */}
      <section className="max-w-[1440px] mx-auto grid gap-6 md:grid-cols-2">
        {teamsData.map((team) => (
          <div
            key={team.id}
            className="app-card p-6 space-y-4 hover:-translate-y-1 transition"
          >
            {/* TOP */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-primary">{team.name}</h2>
              <span className="text-sm text-secondary">
                {team.players} Players
              </span>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted">Captain</p>
                <p className="font-semibold text-primary">{team.captain}</p>
              </div>

              <div>
                <p className="text-muted">Vice Captain</p>
                <p className="font-semibold text-primary">{team.viceCaptain}</p>
              </div>

              <div>
                <p className="text-muted">Credits Used</p>
                <p className="font-semibold text-primary">{team.creditsUsed}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2 rounded-xl text-sm font-semibold btn-outline">
                Preview
              </button>

              <button className="flex-1 py-2 rounded-xl text-sm font-semibold btn-primary">
                Edit Team
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
