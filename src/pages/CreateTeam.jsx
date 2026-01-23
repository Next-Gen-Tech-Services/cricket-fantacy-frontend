import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiX, FiShield, FiStar, FiSearch, FiInfo, FiRefreshCw, FiChevronLeft } from "react-icons/fi";

/* ------------------ CONFIG ------------------ */
const TEAM_RULES = {
  WK: { min: 1, max: 1 },
  BAT: { min: 3, max: 4 },
  AR: { min: 1, max: 2 },
  BOWL: { min: 3, max: 4 },
  TOTAL: 11,
  BUDGET: 100,
};

/* ------------------ SAMPLE DATA - 30 PLAYERS (15 IND + 15 AUS) ------------------ */
const players = [
  // INDIA TEAM (15 players)
  { id: 1, name: "Rohit Sharma", role: "BAT", team: "IND", teamColor: "#FF9933", price: 9.5, points: 125, avatar: "https://ui-avatars.com/api/?name=Rohit+Sharma&background=FF9933&color=fff&size=80" },
  { id: 2, name: "Virat Kohli", role: "BAT", team: "IND", teamColor: "#FF9933", price: 10.0, points: 140, avatar: "https://ui-avatars.com/api/?name=Virat+Kohli&background=FF9933&color=fff&size=80" },
  { id: 3, name: "Shubman Gill", role: "BAT", team: "IND", teamColor: "#FF9933", price: 8.5, points: 115, avatar: "https://ui-avatars.com/api/?name=Shubman+Gill&background=FF9933&color=fff&size=80" },
  { id: 4, name: "Shreyas Iyer", role: "BAT", team: "IND", teamColor: "#FF9933", price: 8.0, points: 105, avatar: "https://ui-avatars.com/api/?name=Shreyas+Iyer&background=FF9933&color=fff&size=80" },
  { id: 5, name: "KL Rahul", role: "WK", team: "IND", teamColor: "#FF9933", price: 9.0, points: 118, avatar: "https://ui-avatars.com/api/?name=KL+Rahul&background=FF9933&color=fff&size=80" },
  { id: 6, name: "Rishabh Pant", role: "WK", team: "IND", teamColor: "#FF9933", price: 9.0, points: 120, avatar: "https://ui-avatars.com/api/?name=Rishabh+Pant&background=FF9933&color=fff&size=80" },
  { id: 7, name: "Hardik Pandya", role: "AR", team: "IND", teamColor: "#FF9933", price: 9.5, points: 130, avatar: "https://ui-avatars.com/api/?name=Hardik+Pandya&background=FF9933&color=fff&size=80" },
  { id: 8, name: "Ravindra Jadeja", role: "AR", team: "IND", teamColor: "#FF9933", price: 9.0, points: 125, avatar: "https://ui-avatars.com/api/?name=Ravindra+Jadeja&background=FF9933&color=fff&size=80" },
  { id: 9, name: "Axar Patel", role: "AR", team: "IND", teamColor: "#FF9933", price: 8.0, points: 110, avatar: "https://ui-avatars.com/api/?name=Axar+Patel&background=FF9933&color=fff&size=80" },
  { id: 10, name: "Jasprit Bumrah", role: "BOWL", team: "IND", teamColor: "#FF9933", price: 9.5, points: 135, avatar: "https://ui-avatars.com/api/?name=Jasprit+Bumrah&background=FF9933&color=fff&size=80" },
  { id: 11, name: "Mohammed Shami", role: "BOWL", team: "IND", teamColor: "#FF9933", price: 8.5, points: 122, avatar: "https://ui-avatars.com/api/?name=Mohammed+Shami&background=FF9933&color=fff&size=80" },
  { id: 12, name: "Mohammed Siraj", role: "BOWL", team: "IND", teamColor: "#FF9933", price: 8.5, points: 118, avatar: "https://ui-avatars.com/api/?name=Mohammed+Siraj&background=FF9933&color=fff&size=80" },
  { id: 13, name: "Kuldeep Yadav", role: "BOWL", team: "IND", teamColor: "#FF9933", price: 8.0, points: 112, avatar: "https://ui-avatars.com/api/?name=Kuldeep+Yadav&background=FF9933&color=fff&size=80" },
  { id: 14, name: "Yuzvendra Chahal", role: "BOWL", team: "IND", teamColor: "#FF9933", price: 8.0, points: 108, avatar: "https://ui-avatars.com/api/?name=Yuzvendra+Chahal&background=FF9933&color=fff&size=80" },
  { id: 15, name: "Shardul Thakur", role: "AR", team: "IND", teamColor: "#FF9933", price: 7.5, points: 102, avatar: "https://ui-avatars.com/api/?name=Shardul+Thakur&background=FF9933&color=fff&size=80" },

  // AUSTRALIA TEAM (15 players)
  { id: 16, name: "David Warner", role: "BAT", team: "AUS", teamColor: "#FFD700", price: 9.5, points: 128, avatar: "https://ui-avatars.com/api/?name=David+Warner&background=FFD700&color=000&size=80" },
  { id: 17, name: "Steve Smith", role: "BAT", team: "AUS", teamColor: "#FFD700", price: 9.5, points: 132, avatar: "https://ui-avatars.com/api/?name=Steve+Smith&background=FFD700&color=000&size=80" },
  { id: 18, name: "Marnus Labuschagne", role: "BAT", team: "AUS", teamColor: "#FFD700", price: 9.0, points: 120, avatar: "https://ui-avatars.com/api/?name=Marnus+Labuschagne&background=FFD700&color=000&size=80" },
  { id: 19, name: "Travis Head", role: "BAT", team: "AUS", teamColor: "#FFD700", price: 8.5, points: 115, avatar: "https://ui-avatars.com/api/?name=Travis+Head&background=FFD700&color=000&size=80" },
  { id: 20, name: "Alex Carey", role: "WK", team: "AUS", teamColor: "#FFD700", price: 8.0, points: 105, avatar: "https://ui-avatars.com/api/?name=Alex+Carey&background=FFD700&color=000&size=80" },
  { id: 21, name: "Josh Inglis", role: "WK", team: "AUS", teamColor: "#FFD700", price: 8.0, points: 108, avatar: "https://ui-avatars.com/api/?name=Josh+Inglis&background=FFD700&color=000&size=80" },
  { id: 22, name: "Glenn Maxwell", role: "AR", team: "AUS", teamColor: "#FFD700", price: 9.0, points: 125, avatar: "https://ui-avatars.com/api/?name=Glenn+Maxwell&background=FFD700&color=000&size=80" },
  { id: 23, name: "Mitchell Marsh", role: "AR", team: "AUS", teamColor: "#FFD700", price: 8.5, points: 118, avatar: "https://ui-avatars.com/api/?name=Mitchell+Marsh&background=FFD700&color=000&size=80" },
  { id: 24, name: "Cameron Green", role: "AR", team: "AUS", teamColor: "#FFD700", price: 8.5, points: 115, avatar: "https://ui-avatars.com/api/?name=Cameron+Green&background=FFD700&color=000&size=80" },
  { id: 25, name: "Pat Cummins", role: "BOWL", team: "AUS", teamColor: "#FFD700", price: 9.5, points: 130, avatar: "https://ui-avatars.com/api/?name=Pat+Cummins&background=FFD700&color=000&size=80" },
  { id: 26, name: "Mitchell Starc", role: "BOWL", team: "AUS", teamColor: "#FFD700", price: 9.0, points: 126, avatar: "https://ui-avatars.com/api/?name=Mitchell+Starc&background=FFD700&color=000&size=80" },
  { id: 27, name: "Josh Hazlewood", role: "BOWL", team: "AUS", teamColor: "#FFD700", price: 8.5, points: 120, avatar: "https://ui-avatars.com/api/?name=Josh+Hazlewood&background=FFD700&color=000&size=80" },
  { id: 28, name: "Adam Zampa", role: "BOWL", team: "AUS", teamColor: "#FFD700", price: 8.0, points: 112, avatar: "https://ui-avatars.com/api/?name=Adam+Zampa&background=FFD700&color=000&size=80" },
  { id: 29, name: "Nathan Lyon", role: "BOWL", team: "AUS", teamColor: "#FFD700", price: 8.0, points: 110, avatar: "https://ui-avatars.com/api/?name=Nathan+Lyon&background=FFD700&color=000&size=80" },
  { id: 30, name: "Marcus Stoinis", role: "AR", team: "AUS", teamColor: "#FFD700", price: 7.5, points: 105, avatar: "https://ui-avatars.com/api/?name=Marcus+Stoinis&background=FFD700&color=000&size=80" },
];

const roleLabel = {
  WK: "Wicket Keeper",
  BAT: "Batsman",
  AR: "All-Rounder",
  BOWL: "Bowler",
};

/* ------------------ VALIDATION FUNCTION ------------------ */
function validateTeam(players) {
  const errors = [];

  if (players.length !== TEAM_RULES.TOTAL) {
    errors.push("A fantasy team must consist of exactly 11 players.");
  }

  const roleCount = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };
  let totalCredits = 0;

  for (const player of players) {
    roleCount[player.role]++;
    totalCredits += player.price;
  }

  for (const role of ["WK", "BAT", "AR", "BOWL"]) {
    const { min, max } = TEAM_RULES[role];
    if (roleCount[role] < min || roleCount[role] > max) {
      errors.push(
        `${roleLabel[role]} count must be between ${min} and ${max}.`
      );
    }
  }

  if (totalCredits > TEAM_RULES.BUDGET) {
    errors.push("Total credits must not exceed 100.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default function CreateTeam() {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [sortBy, setSortBy] = useState("points");
  const [viewMode, setViewMode] = useState("pitch");

  const totalCredits = selected.reduce((a, b) => a + b.price, 0);
  const validation = validateTeam(selected);

  const countByRole = (role) =>
    selected.filter((p) => p.role === role).length;

  // Filter and sort players
  const filteredPlayers = players
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === "all" || p.role === filterRole;
      const matchesTeam = filterTeam === "all" || p.team === filterTeam;
      return matchesSearch && matchesRole && matchesTeam;
    })
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });

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
      if (captain === player.id) setCaptain(null);
      if (viceCaptain === player.id) setViceCaptain(null);
    } else {
      if (!canAdd(player)) return;
      setSelected([...selected, player]);
    }
  };

  const selectCaptain = (playerId) => {
    if (viceCaptain === playerId) {
      setViceCaptain(captain);
    }
    setCaptain(playerId);
  };

  const selectViceCaptain = (playerId) => {
    if (captain === playerId) {
      setCaptain(viceCaptain);
    }
    setViceCaptain(playerId);
  };

  const autoPickTeam = () => {
    const sorted = [...players].sort((a, b) => b.points - a.points);
    const autoPicked = [];
    let budget = TEAM_RULES.BUDGET;
    const roleCounts = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };

    for (const player of sorted) {
      if (autoPicked.length >= TEAM_RULES.TOTAL) break;
      if (budget >= player.price && roleCounts[player.role] < TEAM_RULES[player.role].max) {
        autoPicked.push(player);
        budget -= player.price;
        roleCounts[player.role]++;
      }
    }
    setSelected(autoPicked);
    setCaptain(null);
    setViceCaptain(null);
  };

  const resetTeam = () => {
    setSelected([]);
    setCaptain(null);
    setViceCaptain(null);
  };

  return (
    <main style={{ backgroundColor: '#001f3f' }} className="min-h-screen">
      {/* Header Section */}
      {tournamentId && matchId && (
        <div style={{ backgroundColor: '#002a54' }} className="border-b border-white/10">
          <div className="max-w-[1440px] mx-auto px-4 py-4">
            <button
              onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}`)}
              className="flex items-center text-white hover:text-yellow-400 transition-colors mb-3"
            >
              <FiChevronLeft size={20} className="mr-1" />
              Back to Match Details
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Create Your Fantasy Team</h1>
                <p className="text-gray-300 text-sm">IND vs AUS • Select 11 players within 100cr budget</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                <FiShield className="text-yellow-400" size={20} />
                <span className="text-white font-semibold">Fantasy XI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 py-6 lg:py-8 grid lg:grid-cols-[420px_1fr] gap-6">
        {/* ================= LEFT : PLAYER LIST ================= */}
        <section className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 h-fit sticky top-6">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">
              Player Selection
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Select 11 players from 30 available (IND vs AUS)
            </p>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
              >
                <option value="all">All Teams</option>
                <option value="IND">India (IND)</option>
                <option value="AUS">Australia (AUS)</option>
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="WK">Wicket Keepers</option>
                <option value="BAT">Batsmen</option>
                <option value="AR">All-Rounders</option>
                <option value="BOWL">Bowlers</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
            >
              <option value="points">Sort by Points</option>
              <option value="price">Sort by Price</option>
            </select>
            <div className="bg-gray-900 text-white text-center py-2 rounded-lg text-sm font-semibold">
              {filteredPlayers.length} players shown
            </div>
          </div>

          {/* Players List */}
          <div className="max-h-[calc(100vh-440px)] overflow-y-auto">
            {["WK", "BAT", "AR", "BOWL"].map((role) => {
              const rolePlayers = filteredPlayers.filter((p) => p.role === role);
              if (rolePlayers.length === 0) return null;

              return (
                <div key={role}>
                  <div className="sticky top-0 bg-[#273470] px-4 py-2 border-b border-white/20 flex items-center justify-between text-xs font-bold text-white uppercase z-10">
                    <span>{roleLabel[role]}</span>
                    <div className="flex items-center gap-6 text-gray-300">
                      <span className="w-12 text-center">Price</span>
                      <span className="w-8 text-center">TP</span>
                    </div>
                  </div>

                  {rolePlayers.map((player) => {
                    const isSelected = selected.some((p) => p.id === player.id);
                    const isCaptain = captain === player.id;
                    const isViceCaptain = viceCaptain === player.id;

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between px-4 py-3 border-b border-white/10 hover:bg-white/5 transition-colors ${
                          isSelected ? "bg-white/10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <div 
                              className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm"
                              style={{ backgroundColor: player.teamColor }}
                            >
                              {player.team}
                            </div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#273470] rounded-full flex items-center justify-center">
                                <span className="text-white text-[8px]">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white truncate">
                                {player.name}
                              </p>
                              {isCaptain && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-yellow-900 rounded">
                                  C
                                </span>
                              )}
                              {isViceCaptain && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-400 text-white rounded">
                                  VC
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-300">
                              {player.team} • {player.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white w-12 text-center">
                            {player.price}cr
                          </span>
                          <span className="text-sm text-gray-300 w-8 text-center">
                            {player.points}
                          </span>
                          
                          {/* Captain/VC Selection Buttons */}
                          {isSelected && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => selectCaptain(player.id)}
                                disabled={isCaptain}
                                className={`p-1.5 rounded transition-colors ${
                                  isCaptain
                                    ? "bg-yellow-400 text-yellow-900"
                                    : "bg-white/10 hover:bg-yellow-100 hover:text-yellow-900 text-gray-300"
                                }`}
                                title="Make Captain"
                              >
                                <FiShield size={14} />
                              </button>
                              <button
                                onClick={() => selectViceCaptain(player.id)}
                                disabled={isViceCaptain}
                                className={`p-1.5 rounded transition-colors ${
                                  isViceCaptain
                                    ? "bg-orange-400 text-white"
                                    : "bg-white/10 hover:bg-orange-100 hover:text-orange-900 text-gray-300"
                                }`}
                                title="Make Vice Captain"
                              >
                                <FiStar size={14} />
                              </button>
                            </div>
                          )}
                          
                          <button
                            onClick={() => togglePlayer(player)}
                            disabled={!isSelected && !canAdd(player)}
                            className="ml-1"
                          >
                            {isSelected ? (
                              <div className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors">
                                <FiX size={16} />
                              </div>
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
                                canAdd(player) ? "bg-yellow-400 hover:bg-yellow-500 text-[#273470]" : "bg-gray-600 cursor-not-allowed"
                              }`}>
                                <FiPlus size={16} />
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= RIGHT : PITCH/LIST VIEW ================= */}
        <section className="bg-[#1a2450] rounded-xl shadow-lg border border-white/10 overflow-hidden">
          {/* Header with Tabs */}
          <div className="border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("pitch")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    viewMode === "pitch"
                      ? "bg-yellow-400 text-[#273470]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Pitch View
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-yellow-400 text-[#273470]"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  List View
                </button>
              </div>
            </div>

            {/* Match Info Banner */}
            <div className="bg-[#273470] px-6 py-3 text-white text-center text-sm font-semibold">
              IND vs AUS • Select 11 from 30 Players
            </div>

            {/* Stats Bar */}
            <div className="bg-[#273470]/50 px-6 py-4 flex items-center justify-between text-sm flex-wrap gap-3 border-b border-white/10">
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  selected.length === TEAM_RULES.TOTAL
                    ? "bg-green-500 text-white"
                    : "bg-white/10 border-2 border-yellow-400 text-white"
                }`}>
                  {selected.length}/{TEAM_RULES.TOTAL}
                  <span className="ml-2 font-normal text-xs">Players Selected</span>
                </div>
                <div className="px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg font-bold text-white">
                  {(TEAM_RULES.BUDGET - totalCredits).toFixed(1)}cr
                  <span className="ml-2 font-normal text-xs">Budget</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pitch/List Content */}
          <div className="p-6">
            {viewMode === "pitch" ? (
              <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden min-h-[600px]"
                style={{
                  background: "linear-gradient(180deg, #15803d 0%, #14532d 100%)",
                }}
              >
                {/* Cricket Pitch Design */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-full w-32 bg-gradient-to-b from-amber-200/20 via-yellow-100/15 to-amber-200/20 opacity-40">
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-1 h-8 bg-white/60 rounded-full"></div>
                      <div className="w-1 h-8 bg-white/60 rounded-full"></div>
                      <div className="w-1 h-8 bg-white/60 rounded-full"></div>
                    </div>
                    <div className="absolute top-16 left-0 right-0 h-0.5 bg-white/50"></div>
                    
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                      <div className="w-1 h-8 bg-white/60 rounded-full"></div>
                      <div className="w-1 h-8 bg-white/60 rounded-full"></div>
                      <div className="w-1 h-8 bg-white/60 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-white/50"></div>
                  </div>
                  
                  <div className="absolute inset-0 border-2 border-white/10 rounded-full m-4"></div>
                </div>

                {/* PITCH FORMATION */}
                <div className="relative z-10 grid grid-rows-4 gap-6 lg:gap-8 text-center">
                  <PitchRow
                    title="WICKET KEEPER"
                    players={selected.filter((p) => p.role === "WK")}
                    captain={captain}
                    viceCaptain={viceCaptain}
                    onSelectCaptain={selectCaptain}
                    onSelectViceCaptain={selectViceCaptain}
                    max={TEAM_RULES.WK.max}
                  />
                  <PitchRow
                    title="BATSMEN"
                    players={selected.filter((p) => p.role === "BAT")}
                    captain={captain}
                    viceCaptain={viceCaptain}
                    onSelectCaptain={selectCaptain}
                    onSelectViceCaptain={selectViceCaptain}
                    max={TEAM_RULES.BAT.max}
                  />
                  <PitchRow
                    title="ALL-ROUNDERS"
                    players={selected.filter((p) => p.role === "AR")}
                    captain={captain}
                    viceCaptain={viceCaptain}
                    onSelectCaptain={selectCaptain}
                    onSelectViceCaptain={selectViceCaptain}
                    max={TEAM_RULES.AR.max}
                  />
                  <PitchRow
                    title="BOWLERS"
                    players={selected.filter((p) => p.role === "BOWL")}
                    captain={captain}
                    viceCaptain={viceCaptain}
                    onSelectCaptain={selectCaptain}
                    onSelectViceCaptain={selectViceCaptain}
                    max={TEAM_RULES.BOWL.max}
                  />
                </div>
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {["WK", "BAT", "AR", "BOWL"].map((role) => {
                  const rolePlayers = selected.filter((p) => p.role === role);
                  if (rolePlayers.length === 0) return null;

                  return (
                    <div key={role}>
                      <h3 className="text-sm font-bold text-white uppercase mb-2">
                        {roleLabel[role]}
                      </h3>
                      <div className="space-y-2">
                        {rolePlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between bg-white/10 border border-white/20 rounded-lg px-4 py-3 hover:bg-white/15 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: player.teamColor }}
                              >
                                {player.team}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {player.name}
                                </p>
                                <p className="text-xs text-gray-300">
                                  {player.team} • {player.price}cr
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePlayer(player)}
                              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {selected.length === 0 && (
                  <div className="text-center text-gray-300 py-12">
                    <p className="text-lg font-semibold mb-2">No players selected</p>
                    <p className="text-sm">Select 11 players from the left panel to build your team</p>
                  </div>
                )}
              </div>
            )}

            {/* Validation Errors */}
            {selected.length > 0 && !validation.isValid && (
              <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-sm font-bold text-red-400 mb-2">⚠️ Team Validation Issues:</p>
                <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">
                  {validation.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex gap-3">
                <button
                  onClick={autoPickTeam}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 border border-white/20"
                >
                  <FiRefreshCw size={16} />
                  Auto Pick
                </button>
                <button
                  onClick={resetTeam}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                >
                  Reset
                </button>
              </div>
              <button
                disabled={!validation.isValid || !captain || !viceCaptain}
                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-[#273470] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400 shadow-lg hover:shadow-yellow-400/50"
              >
                {!validation.isValid
                  ? "Complete Team"
                  : !captain || !viceCaptain
                  ? "Select C & VC"
                  : "Save Team"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ------------------ PITCH ROW COMPONENT ------------------ */
function PitchRow({ title, players, captain, viceCaptain, onSelectCaptain, onSelectViceCaptain, max }) {
  const emptySlots = max - players.length;

  return (
    <div>
      <p className="mb-3 text-xs uppercase opacity-90 font-bold tracking-wider">
        {title}
      </p>

      <div className="flex justify-center gap-3 lg:gap-4 flex-wrap">
        {players.map((p) => {
          const isCaptain = captain === p.id;
          const isViceCaptain = viceCaptain === p.id;

          return (
            <div
              key={p.id}
              className="relative group"
            >
              {/* Captain/Vice Captain Shield Icon */}
              {isCaptain && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                  <FiShield className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                </div>
              )}
              {isViceCaptain && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                  <FiStar className="w-5 h-5 text-orange-400 drop-shadow-lg" />
                </div>
              )}

              {/* Player Card */}
              <div className="relative">
                <div
                  className={`w-24 lg:w-28 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-xl
                    ${isCaptain || isViceCaptain
                      ? "ring-2 ring-yellow-400 ring-offset-2"
                      : ""
                    }`}
                >
                  {/* Jersey/Team Color */}
                  <div 
                    className="w-full aspect-square flex items-center justify-center text-white font-bold text-2xl relative"
                    style={{ backgroundColor: p.teamColor }}
                  >
                    <span className="text-lg">{p.team}</span>
                    {/* Price Tag */}
                    <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.price}cr
                    </div>
                  </div>
                  
                  {/* Player Info */}
                  <div className="p-2 bg-white text-center">
                    <p className="text-xs font-bold text-gray-900 leading-tight truncate">
                      {p.name.split(" ").slice(-1)[0]}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {p.team} ({p.role})
                    </p>
                  </div>
                </div>
              </div>

              {/* Captain/VC Selection Dropdown */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col gap-1 bg-white rounded-lg shadow-xl p-2 z-30 min-w-[120px]">
                <button
                  onClick={() => onSelectCaptain(p.id)}
                  disabled={isCaptain}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                >
                  <FiShield size={12} />
                  {isCaptain ? "Captain" : "Make Captain"}
                </button>
                <button
                  onClick={() => onSelectViceCaptain(p.id)}
                  disabled={isViceCaptain}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-orange-100 text-orange-800 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                >
                  <FiStar size={12} />
                  {isViceCaptain ? "Vice Captain" : "Make V.Captain"}
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty Slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-20 h-20 lg:w-24 lg:h-24 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl font-bold border-2 border-dashed border-white/30"
          >
            +
          </div>
        ))}
      </div>
    </div>
  );
}
