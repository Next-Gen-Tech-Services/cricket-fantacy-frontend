import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAward, FiTrendingUp, FiUser, FiShield, FiStar } from "react-icons/fi";

// Mock leaderboard data
const LEADERBOARD_DATA = [
  {
    rank: 1,
    username: "CricketKing_2026",
    teamName: "Ultimate XI",
    points: 1450,
    captain: "Virat Kohli",
    viceCaptain: "Rohit Sharma",
    avatar: "👑"
  },
  {
    rank: 2,
    username: "FantasyChamp",
    teamName: "Dream Warriors",
    points: 1398,
    captain: "Steve Smith",
    viceCaptain: "Pat Cummins",
    avatar: "🏆"
  },
  {
    rank: 3,
    username: "CricketFanatic",
    teamName: "Victory Squad",
    points: 1375,
    captain: "Jasprit Bumrah",
    viceCaptain: "KL Rahul",
    avatar: "⚡"
  },
  {
    rank: 4,
    username: "MasterBlaster_99",
    teamName: "Power Hitters",
    points: 1342,
    captain: "Rohit Sharma",
    viceCaptain: "Virat Kohli",
    avatar: "🔥"
  },
  {
    rank: 5,
    username: "SpinWizard",
    teamName: "Spin Kings",
    points: 1310,
    captain: "Ravindra Jadeja",
    viceCaptain: "Yuzvendra Chahal",
    avatar: "🎯"
  },
  {
    rank: 6,
    username: "FastBowler_Pro",
    teamName: "Pace Attack",
    points: 1285,
    captain: "Jasprit Bumrah",
    viceCaptain: "Mohammed Shami",
    avatar: "💨"
  },
  {
    rank: 7,
    username: "AllRounder_Elite",
    teamName: "Balanced Force",
    points: 1260,
    captain: "Hardik Pandya",
    viceCaptain: "Ravindra Jadeja",
    avatar: "⚔️"
  },
  {
    rank: 8,
    username: "BoundaryKing",
    teamName: "Six Shooters",
    points: 1235,
    captain: "Suryakumar Yadav",
    viceCaptain: "Glenn Maxwell",
    avatar: "🎪"
  },
  {
    rank: 9,
    username: "WicketKeeper_Boss",
    teamName: "Stumpers United",
    points: 1210,
    captain: "Rishabh Pant",
    viceCaptain: "MS Dhoni",
    avatar: "🧤"
  },
  {
    rank: 10,
    username: "TacticalMaster",
    teamName: "Strategy XI",
    points: 1190,
    captain: "Kane Williamson",
    viceCaptain: "Babar Azam",
    avatar: "🧠"
  },
  // Add more users for scrolling
  ...Array.from({ length: 40 }, (_, i) => ({
    rank: i + 11,
    username: `Player_${i + 11}`,
    teamName: `Team ${i + 11}`,
    points: 1180 - (i * 15),
    captain: ["Virat Kohli", "Rohit Sharma", "Steve Smith", "David Warner"][i % 4],
    viceCaptain: ["Jasprit Bumrah", "Pat Cummins", "Rashid Khan", "Trent Boult"][i % 4],
    avatar: ["🏏", "⭐", "🎲", "🎮"][i % 4]
  }))
];

const Leaderboard = () => {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overall");

  // Simulate user's rank (normally this would come from API based on logged-in user)
  const userRank = 15;
  const userEntry = LEADERBOARD_DATA[userRank - 1];

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-[#c4722a]";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-[#273470] to-[#1e2859]";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#001f3f' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#002a54' }} className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}`)}
            className="flex items-center text-white hover:text-yellow-400 transition-colors mb-4"
          >
            <FiChevronLeft size={20} className="mr-1" />
            Back to Match
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiAward className="text-yellow-400" size={36} />
                <h1 className="text-4xl font-extrabold text-white">Leaderboard</h1>
              </div>
              <p className="text-gray-300 text-lg">Compete for the top spot and win amazing prizes!</p>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <FiAward className="mx-auto text-yellow-400 mb-2" size={32} />
              <p className="text-3xl font-bold text-white">$5,000</p>
              <p className="text-sm text-gray-400">Prize Pool</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User's Rank Card (Pinned) */}
        {userEntry && (
          <div className="mb-6 bg-gradient-to-r from-[#273470]/30 to-[#1e2859]/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#273470] shadow-2xl">
            <p className="text-gray-300 text-sm mb-3 font-semibold">YOUR POSITION</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getRankColor(userEntry.rank)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-2xl">{getRankIcon(userEntry.rank)}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{userEntry.username}</p>
                  <p className="text-gray-400 text-sm">{userEntry.teamName}</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">{userEntry.points}</p>
                <p className="text-gray-400 text-sm">Points</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                  <FiShield size={16} />
                  <span className="text-white text-sm font-semibold">{userEntry.captain}</span>
                </div>
                <p className="text-gray-400 text-xs">Captain</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                  <FiStar size={16} />
                  <span className="text-white text-sm font-semibold">{userEntry.viceCaptain}</span>
                </div>
                <p className="text-gray-400 text-xs">Vice Captain</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team`)}
                  className="bg-gradient-to-r from-[#273470] to-[#1e2859] hover:from-[#1e2859] hover:to-[#161d40] text-white font-semibold py-2 px-6 rounded-lg transition-all"
                >
                  Edit Team
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["overall", "top-100", "friends"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                    ? "bg-yellow-400 text-white"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/20">
          {/* Table Header */}
          <div className="bg-yellow-400 px-6 py-4">
            <div className="grid grid-cols-5 gap-4 text-gray-900 font-semibold text-sm">
              <div>RANK & PLAYER</div>
              <div className="text-center">TEAM NAME</div>
              <div className="text-center">POINTS</div>
              <div className="text-center">CAPTAIN</div>
              <div className="text-center">VICE CAPTAIN</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
            {LEADERBOARD_DATA.map((entry) => {
              const isTopThree = entry.rank <= 3;
              const isUser = entry.rank === userRank;
              
              return (
                <div
                  key={entry.rank}
                  className={`px-6 py-4 hover:bg-white/5 transition-colors ${
                    isUser ? "bg-purple-600/20" : ""
                  } ${
                    isTopThree ? "bg-gradient-to-r from-orange-500/5 to-orange-600/5" : ""
                  }`}
                >
                  <div className="grid grid-cols-5 gap-4 items-center">
                    {/* Rank & Username */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-lg">
                          {getRankIcon(entry.rank)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{entry.avatar}</span>
                          <p className="text-white font-semibold">{entry.username}</p>
                          {isUser && (
                            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Team Name */}
                    <div className="text-center">
                      <p className="text-gray-300 font-medium">{entry.teamName}</p>
                    </div>

                    {/* Points */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#273470]/30 to-[#1e2859]/30 px-4 py-2 rounded-lg">
                        <FiTrendingUp className="text-green-400" size={16} />
                        <span className="text-white font-bold text-lg">{entry.points}</span>
                      </div>
                    </div>

                    {/* Captain */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 text-yellow-400">
                        <FiShield size={14} />
                        <span className="text-white text-sm">{entry.captain}</span>
                      </div>
                    </div>

                    {/* Vice Captain */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 text-orange-400">
                        <FiStar size={14} />
                        <span className="text-white text-sm">{entry.viceCaptain}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prize Distribution */}
        <div className="mt-8 bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <FiAward className="mr-3 text-yellow-400" size={28} />
            Prize Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center border-2 border-yellow-400">
              <div className="text-4xl mb-2">🥇</div>
              <p className="text-2xl font-bold text-yellow-400">$2,500</p>
              <p className="text-gray-300 text-sm">1st Place</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center border-2 border-gray-400">
              <div className="text-4xl mb-2">🥈</div>
              <p className="text-2xl font-bold text-gray-300">$1,500</p>
              <p className="text-gray-300 text-sm">2nd Place</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center border-2 border-orange-400">
              <div className="text-4xl mb-2">🥉</div>
              <p className="text-2xl font-bold text-orange-400">$1,000</p>
              <p className="text-gray-300 text-sm">3rd Place</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
