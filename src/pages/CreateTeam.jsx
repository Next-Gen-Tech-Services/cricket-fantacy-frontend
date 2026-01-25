import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FiPlus, FiX, FiShield, FiStar, FiSearch, FiInfo, FiRefreshCw, FiChevronLeft, FiAward, FiClock, FiMapPin, FiUsers } from "react-icons/fi";
import { matchesAPI } from "../services/api";

/* ------------------ CONFIG ------------------ */
const TEAM_RULES = {
  WK: { min: 1, max: 1 },
  BAT: { min: 3, max: 4 },
  AR: { min: 1, max: 2 },
  BOWL: { min: 3, max: 4 },
  TOTAL: 11,
  BUDGET: 100,
};

/* ------------------ DUMMY DATA ------------------ */
const currentMatch = {
  name: "Chattogram Royals vs Rajshahi Warriors",
  status: "upcoming",
  startedAt: "2026-01-23T17:30:00Z",
  venue: {
    name: "Sher-E-Bangla National Cricket Stadium",
    city: "Dhaka"
  },
  format: "t20"
};

/* ------------------ UTILITY FUNCTIONS ------------------ */
const getStatusColor = (status) => {
  switch (status) {
    case "upcoming": return "bg-blue-500";
    case "live": return "bg-green-500";
    case "completed": return "bg-gray-500";
    default: return "bg-gray-500";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "upcoming": return "UPCOMING";
    case "live": return "LIVE";
    case "completed": return "COMPLETED";
    default: return "UNKNOWN";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
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
function validateTeam(players, walletBalance = 100) {
  const errors = [];

  if (players.length !== TEAM_RULES.TOTAL) {
    errors.push(`Team must have exactly ${TEAM_RULES.TOTAL} players (currently ${players.length}).`);
  }

  const roleCount = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };
  let totalCredits = 0;

  for (const player of players) {
    roleCount[player.role]++;
    totalCredits += player.price;
  }

  for (const role of ["WK", "BAT", "AR", "BOWL"]) {
    const { min, max } = TEAM_RULES[role];
    if (roleCount[role] < min) {
      errors.push(`Need at least ${min} ${roleLabel[role]}${min > 1 ? 's' : ''} (currently ${roleCount[role]}).`);
    }
    if (roleCount[role] > max) {
      errors.push(`Cannot have more than ${max} ${roleLabel[role]}${max > 1 ? 's' : ''} (currently ${roleCount[role]}).`);
    }
  }

  if (totalCredits > TEAM_RULES.BUDGET) {
    errors.push(`Total ptsedits must not exceed ${TEAM_RULES.BUDGET}pts (currently ${totalCredits.toFixed(1)}pts).`);
  }

  if (totalCredits > walletBalance) {
    errors.push(`Insufficient wallet balance. Need ${totalCredits.toFixed(1)}pts but only have ${walletBalance.toFixed(1)}pts.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default function CreateTeam() {
  const { matchId } = useParams(); // Get match ID from route params
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [sortBy, setSortBy] = useState("points");
  const [viewMode, setViewMode] = useState("pitch");

  // User's wallet balance (you can fetch this from API or context)
  const [walletBalance] = useState(100); // Example: user has 100pts in wallet

  // Fetch match data and players on component mount
  useEffect(() => {
    const fetchMatchPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!matchId) {
          throw new Error('Match ID is required');
        }

        // Fetch match details with players from database
        const response = await matchesAPI.getPlayersById(matchId);
        
        if (response.success && response.data) {
          setMatchData(response.data.match);
          // Transform players to match expected format
          const transformedPlayers = (response.data.players || []).map(player => ({
            id: player._id || player.id,
            playerId: player.playerId,
            name: player.name,
            shortName: player.shortName || player.name,
            role: player.role,
            team: player.team?.code || player.team?.shortName || player.team,
            teamColor: player.team?.colors?.primary || '#000000',
            price: player.credits || 8.0,
            points: player.fantasyPoints || 0,
            avatar: player.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random&color=fff&size=80`,
            stats: player.stats || {}
          }));
          setPlayers(transformedPlayers);
        } else {
          throw new Error('Failed to fetch match data');
        }
      } catch (err) {
        console.error('Error fetching match players:', err);
        setError(err.message || 'Failed to load match data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchPlayers();
  }, [matchId]);

  const totalCredits = selected.reduce((a, b) => a + b.price, 0);
  const validation = validateTeam(selected, walletBalance);

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
    // Check if team is already full
    if (selected.length >= TEAM_RULES.TOTAL) return false;

    // Check budget constraint (team budget)
    if (totalCredits + player.price > TEAM_RULES.BUDGET) return false;

    // Check wallet balance constraint
    if (totalCredits + player.price > walletBalance) return false;

    // Check role constraint
    if (countByRole(player.role) >= TEAM_RULES[player.role].max) return false;

    // Check if player is already selected
    if (selected.find(p => p.id === player.id)) return false;

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
    const autoPicked = [];
    let availableBudget = TEAM_RULES.BUDGET;
    const roleCounts = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };

    // Create a copy of players sorted by value (points per price ratio) and points
    const playersWithValue = players.map(p => ({
      ...p,
      valueRatio: p.points / p.price
    }));

    // Phase 1: Fill minimum requirements efficiently
    const roles = ["WK", "BAT", "AR", "BOWL"];
    for (const role of roles) {
      const rolePlayers = playersWithValue
        .filter(p => p.role === role)
        .sort((a, b) => b.valueRatio - a.valueRatio); // Sort by value ratio first

      const minRequired = TEAM_RULES[role].min;

      for (const player of rolePlayers) {
        if (roleCounts[role] >= minRequired) break;
        if (availableBudget >= player.price && !autoPicked.find(p => p.id === player.id)) {
          autoPicked.push(player);
          availableBudget -= player.price;
          roleCounts[player.role]++;
        }
      }
    }

    // Phase 2: Smart selection for remaining slots
    while (autoPicked.length < TEAM_RULES.TOTAL) {
      let bestPlayer = null;
      let bestValue = 0;

      // Consider all remaining players that can fit
      for (const player of playersWithValue) {
        // Skip if already selected
        if (autoPicked.find(p => p.id === player.id)) continue;

        // Skip if role is full
        if (roleCounts[player.role] >= TEAM_RULES[player.role].max) continue;

        // Skip if can't afford
        if (player.price > availableBudget) continue;

        // Calculate value considering remaining slots and budget
        const remainingSlots = TEAM_RULES.TOTAL - autoPicked.length;
        const avgBudgetPerSlot = availableBudget / remainingSlots;

        // Prefer players that fit well within remaining budget distribution
        let playerValue = player.valueRatio;

        // Bonus for affordable players when budget is tight
        if (player.price <= avgBudgetPerSlot) {
          playerValue *= 1.2;
        }

        // Bonus for high points players
        if (player.points > 120) {
          playerValue *= 1.1;
        }

        if (playerValue > bestValue) {
          bestValue = playerValue;
          bestPlayer = player;
        }
      }

      // If we found a suitable player, add them
      if (bestPlayer) {
        autoPicked.push(bestPlayer);
        availableBudget -= bestPlayer.price;
        roleCounts[bestPlayer.role]++;
      } else {
        // If no suitable player found, try to adjust by replacing expensive players
        // Find the most expensive player that can be replaced with a cheaper alternative
        for (let i = autoPicked.length - 1; i >= 0; i--) {
          const currentPlayer = autoPicked[i];
          const sameRolePlayers = playersWithValue
            .filter(p => p.role === currentPlayer.role &&
              p.price < currentPlayer.price &&
              !autoPicked.find(ap => ap.id === p.id))
            .sort((a, b) => b.valueRatio - a.valueRatio);

          if (sameRolePlayers.length > 0) {
            const replacement = sameRolePlayers[0];
            // Replace current player with cheaper alternative
            autoPicked[i] = replacement;
            availableBudget += currentPlayer.price - replacement.price;
            break;
          }
        }

        // Try again with increased budget
        continue;
      }
    }

    // Final check: if still not 11 players, use cheapest available players
    while (autoPicked.length < TEAM_RULES.TOTAL) {
      const cheapestAvailable = playersWithValue
        .filter(p => !autoPicked.find(ap => ap.id === p.id) &&
          roleCounts[p.role] < TEAM_RULES[p.role].max &&
          p.price <= availableBudget)
        .sort((a, b) => a.price - b.price)[0];

      if (cheapestAvailable) {
        autoPicked.push(cheapestAvailable);
        availableBudget -= cheapestAvailable.price;
        roleCounts[cheapestAvailable.role]++;
      } else {
        // If still can't fill, replace most expensive players with cheapest alternatives
        const mostExpensive = autoPicked
          .sort((a, b) => b.price - a.price)[0];

        const cheaperAlternative = playersWithValue
          .filter(p => p.role === mostExpensive.role &&
            p.price < mostExpensive.price &&
            !autoPicked.find(ap => ap.id === p.id))
          .sort((a, b) => a.price - b.price)[0];

        if (cheaperAlternative) {
          const index = autoPicked.findIndex(p => p.id === mostExpensive.id);
          autoPicked[index] = cheaperAlternative;
          availableBudget += mostExpensive.price - cheaperAlternative.price;
        } else {
          break; // Can't optimize further
        }
      }
    }

    setSelected(autoPicked);

    // Auto select Captain and Vice Captain based on highest points
    if (autoPicked.length >= 2) {
      // Sort selected players by points in descending order
      const sortedByPoints = [...autoPicked].sort((a, b) => b.points - a.points);

      // Select top 2 players as Captain and Vice Captain
      setCaptain(sortedByPoints[0].id);
      setViceCaptain(sortedByPoints[1].id);
    } else {
      setCaptain(null);
      setViceCaptain(null);
    }
  };

  const resetTeam = () => {
    setSelected([]);
    setCaptain(null);
    setViceCaptain(null);
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273470] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match data...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Match</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#273470] text-white rounded-lg hover:bg-[#1e2859] transition-colors"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  // Get unique teams from players
  const teams = [...new Set(players.map(p => p.team))];
  
  // Use matchData if available, fallback to currentMatch for structure
  const displayMatch = matchData || currentMatch;

  return (
    <main className="min-h-screen bg-white">


      <div className="max-w-[1440px] mx-auto px-4 pt-8 pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] rounded-xl p-6 mb-8 text-white shadow-lg">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId || -1}`)}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-4"
          >
            <FiChevronLeft size={20} className="mr-1" />
            Back to Tournament
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiAward className="text-white" size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{displayMatch.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(displayMatch.status)}`}>
                  {getStatusText(displayMatch.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {displayMatch.startAt && (
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <FiClock className="mr-2 text-white" size={16} />
                    <span className="text-sm font-medium">
                      {formatDate(new Date(displayMatch.startAt * 1000))} • {formatTime(new Date(displayMatch.startAt * 1000))}
                    </span>
                  </div>
                )}
                {displayMatch.venue?.name && (
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <FiMapPin className="mr-2 text-white" size={16} />
                    <span className="text-sm font-medium">
                      {displayMatch.venue.name}
                      {displayMatch.venue.city && `, ${displayMatch.venue.city}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiShield className="mr-2 text-white" size={16} />
                  <span className="text-sm font-medium">{displayMatch.format?.toUpperCase() || 'CRICKET'}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiUsers className="mr-2 text-white" size={16} />
                  <span className="text-sm font-medium">{players.length} Players Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
                      {currentMatch.venue.city && `, ${currentMatch.venue.city}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiShield className="mr-2 text-white" size={16} />
                  <span className="text-sm font-medium">{currentMatch.format.toUpperCase() || 'Cricket'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4  lg:pb-8 flex flex-col lg:grid lg:grid-cols-[420px_1fr] gap-6">
        {/* ================= LEFT : PLAYER LIST ================= */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm order-2 lg:order-1 lg:h-fit lg:sticky lg:top-6">
          {/* Header */}
          <div className="p-4 pb-3">
            <h2 className="text-lg font-bold text-[#273470] mb-1">
              Player Selection
            </h2>
           
          </div>

          {/* Search and Filters */}
          <div className="px-4 pb-3 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#273470] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Dropdowns Row */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#273470] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none transition-all"
              >
                <option value="all">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#273470] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none transition-all"
              >
                <option value="all">All Roles</option>
                <option value="WK">Wicket Keeper</option>
                <option value="BAT">Batsman</option>
                <option value="AR">All-Rounder</option>
                <option value="BOWL">Bowler</option>
              </select>
            </div>
          </div>

          {/* Players List */}
          <div className="max-h-[calc(100vh-100px)] lg:max-h-[calc(100vh-140px)] overflow-y-auto">
            {["WK", "BAT", "AR", "BOWL"].map((role) => {
              const rolePlayers = filteredPlayers.filter((p) => p.role === role);
              if (rolePlayers.length === 0) return null;

              return (
                <div key={role}>
                  <div className="sticky top-0 bg-[#273470] px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-white uppercase z-10">
                    <span className="truncate">{roleLabel[role]}</span>
                    <div className="flex items-center gap-4 text-white/80 min-w-0">
                      <span className="w-6 text-center flex-shrink-0">C</span>
                      <span className="w-8 text-center flex-shrink-0">VC</span>
                      <button
                        onClick={() => setSortBy('price')}
                        className={`w-12 text-center flex-shrink-0 transition-colors ${
                          sortBy === 'price' ? 'text-yellow-400' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        PRICE 
                      </button>
                      <button
                        onClick={() => setSortBy('points')}
                        className={`w-8 text-center flex-shrink-0 transition-colors ${
                          sortBy === 'points' ? 'text-yellow-400' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        TP
                      </button>
                      <span className="w-8 text-center flex-shrink-0"></span>
                    </div>
                  </div>

                  {rolePlayers.map((player) => {
                    const isSelected = selected.some((p) => p.id === player.id);
                    const isCaptain = captain === player.id;
                    const isViceCaptain = viceCaptain === player.id;

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors ${isSelected ? "bg-blue-50" : ""
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
                              <p className="text-sm font-semibold text-[#273470] truncate max-w-[120px]">
                                {player.name.split(" ").length > 1 
                                  ? `${player.name.split(" ")[0]} ${player.name.split(" ").slice(-1)[0].charAt(0)}.`
                                  : player.name
                                }
                              </p>
                              {/* {isCaptain && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-black rounded">
                                  C
                                </span>
                              )}
                              {isViceCaptain && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded">
                                  VC
                                </span>
                              )} */}
                            </div>
                            <p className="text-xs text-gray-600">
                              {player.team} • {player.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Captain Button Column */}
                          <div className="w-6 flex justify-center">
                            {isSelected && (
                              <button
                                onClick={() => selectCaptain(player.id)}
                                disabled={isCaptain}
                                className={`px-2 py-1.5 rounded text-xs font-bold transition-colors ${isCaptain
                                  ? "bg-yellow-400 text-black"
                                  : "bg-gray-200 hover:bg-yellow-100 hover:text-black text-gray-600"
                                  }`}
                                title="Make Captain"
                              >
                                C
                              </button>
                            )}
                          </div>

                          {/* Vice Captain Button Column */}
                          <div className="w-8 flex justify-center">
                            {isSelected && (
                              <button
                                onClick={() => selectViceCaptain(player.id)}
                                disabled={isViceCaptain}
                                className={`px-1.5 py-1.5 rounded text-xs font-bold transition-colors ${isViceCaptain
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 hover:bg-blue-100 hover:text-blue-900 text-gray-600"
                                  }`}
                                title="Make Vice Captain"
                              >
                                VC
                              </button>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-[#273470] w-12 text-center">
                            {player.price}cr
                          </span>
                          <span className="text-sm text-gray-600 w-8 text-center">
                            {player.points}
                          </span>



                          {/* Add/Remove Button Column */}
                          <div className="w-8 flex justify-center">
                            <button
                              onClick={() => togglePlayer(player)}
                              disabled={!isSelected && !canAdd(player)}
                            >
                              {isSelected ? (
                                <div className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors">
                                  <FiX size={16} />
                                </div>
                              ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${canAdd(player) ? "bg-yellow-400 hover:bg-yellow-500 text-[#273470]" : "bg-gray-600 cursor-not-allowed"
                                  }`}>
                                  <FiPlus size={16} />
                                </div>
                              )}
                            </button>
                          </div>
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
        <section className="bg-gray-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden order-1 lg:order-2">
          {/* Header with Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("pitch")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${viewMode === "pitch"
                    ? "bg-yellow-400 text-[#273470]"
                    : "text-[#273470] hover:bg-gray-200"
                    }`}
                >
                  Pitch View
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${viewMode === "list"
                    ? "bg-yellow-400 text-[#273470]"
                    : "text-[#273470] hover:bg-gray-200"
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
            <div className="bg-[#273470]/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-3 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-bold text-center ${selected.length === TEAM_RULES.TOTAL
                  ? "bg-green-500 text-white"
                  : "bg-white border-2 border-yellow-400 text-[#273470]"
                  }`}>
                  {selected.length}/{TEAM_RULES.TOTAL}
                  <span className="ml-2 font-normal text-xs">Players Selected</span>
                </div>
                <div className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-bold text-[#273470] text-center">
                  {(walletBalance - totalCredits).toFixed(1)}pts
                  <span className="ml-2 font-normal text-xs">Wallet Balance</span>
                </div>
                <div className="px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg font-bold text-blue-700 text-center">
                  {totalCredits.toFixed(1)}/{Math.min(TEAM_RULES.BUDGET, walletBalance).toFixed(1)}pts
                  <span className="ml-2 font-normal text-xs">Used</span>
                </div>
                {/* Team Composition Display */}
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">WK: {countByRole("WK")}/1</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">BAT: {countByRole("BAT")}/4</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">AR: {countByRole("AR")}/2</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">BOWL: {countByRole("BOWL")}/4</span>
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
                      <h3 className="text-sm font-bold text-[#273470] uppercase mb-2">
                        {roleLabel[role]}
                      </h3>
                      <div className="space-y-2">
                        {rolePlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: player.teamColor }}
                              >
                                {player.team}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#273470] max-w-[120px] truncate">
                                  {player.name.split(" ").length > 1 
                                    ? `${player.name.split(" ")[0]} ${player.name.split(" ").slice(-1)[0].charAt(0)}.`
                                    : player.name
                                  }
                                </p>
                                <p className="text-xs text-gray-600">
                                  {player.team} • {player.price}pts
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
                  <div className="text-center text-gray-600 py-12">
                    <p className="text-lg font-semibold mb-2">No players selected</p>
                    <p className="text-sm">Select 11 players from the left panel to build your team</p>
                  </div>
                )}
              </div>
            )}

            {/* Validation Errors */}
            {selected.length > 0 && !validation.isValid && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-bold text-red-600 mb-2">⚠️ Team Validation Issues:</p>
                <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                  {validation.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={autoPickTeam}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#273470] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-300"
                >
                  <FiRefreshCw size={16} />
                  Auto Pick
                </button>
                <button
                  onClick={resetTeam}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#273470] font-semibold rounded-lg transition-colors border border-gray-300"
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
      <p className="mb-3 text-xs uppercase font-bold tracking-wider text-white/90">
        {title}
      </p>

      <div className="flex justify-center gap-2 lg:gap-4 flex-wrap">
        {players.map((p) => {
          const isCaptain = captain === p.id;
          const isViceCaptain = viceCaptain === p.id;

          return (
            <div
              key={p.id}
              className="relative group"
            >
              {/* Captain/Vice Captain Badges - Positioned on left side */}
              {isCaptain && (
                <div className="absolute -top-2 left-0 z-20">
                  <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg">
                    C
                  </div>
                </div>
              )}
              {isViceCaptain && (
                <div className="absolute -top-2 left-0 z-20">
                  <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg">
                    VC
                  </div>
                </div>
              )}

              {/* Player Card */}
              <div className="relative">
                <div
                  className={`w-16 lg:w-24 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-lg
                    ${isCaptain || isViceCaptain
                      ? "ring-2 ring-yellow-400 ring-offset-2"
                      : ""
                    }`}
                >
                  {/* Jersey/Team Color */}
                  <div
                    className="w-full aspect-square flex items-center justify-center text-white font-bold text-lg lg:text-2xl relative"
                    style={{ backgroundColor: p.teamColor }}
                  >
                    <span className="text-sm lg:text-lg">{p.team}</span>
                    {/* Price Tag */}
                    <div className="absolute top-1 right-1 bg-black/70 text-white text-[8px] lg:text-[10px] font-bold px-1 lg:px-2 py-0.5 rounded">
                      {p.price}pts
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="p-1.5 lg:p-2 bg-white text-center">
                    <p className="text-[10px] lg:text-xs font-bold text-gray-900 leading-tight truncate">
                      {p.name.split(" ").slice(-1)[0]}
                    </p>
                    <p className="text-[8px] lg:text-[10px] text-gray-500">
                      {p.team} ({p.role})
                    </p>
                  </div>
                </div>
              </div>

              {/* Captain/VC Selection Dropdown - Hidden on mobile, visible on hover on desktop */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden lg:group-hover:flex flex-col gap-1 bg-white rounded-lg shadow-xl p-2 z-30 min-w-[120px]">
                <button
                  onClick={() => onSelectCaptain(p.id)}
                  disabled={isCaptain}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                >
                  <span className="bg-black text-white px-1 py-0.5 rounded text-xs font-bold">C</span>
                  {isCaptain ? "Captain" : "Make Captain"}
                </button>
                <button
                  onClick={() => onSelectViceCaptain(p.id)}
                  disabled={isViceCaptain}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                >
                  <span className="bg-white text-blue-500 px-1 py-0.5 rounded text-xs font-bold">VC</span>
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
            className="w-16 lg:w-24 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/50 shadow-lg"
          >
            {/* Empty Jersey/Team Area */}
            <div className="w-full aspect-square flex items-center justify-center text-white/70 font-bold text-2xl lg:text-3xl bg-white/10">
              +
            </div>

            {/* Empty Player Info Area */}
            <div className="p-1.5 lg:p-2 bg-white/10 text-center">
              <p className="text-[10px] lg:text-xs font-bold text-white/60 leading-tight">
                Empty
              </p>
              <p className="text-[8px] lg:text-[10px] text-white/50">
                Select Player
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
