import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiAward, FiTrendingUp, FiUser, FiShield, FiStar, FiLoader, FiAlertCircle } from "react-icons/fi";
import { fetchContestLeaderboard } from "../store/slices/contestsSlice";

const Leaderboard = () => {
  const { tournamentId, matchId, contestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overall");

  // Redux state
  const {
    leaderboards,
    loading,
    error
  } = useSelector((state) => state.contests);

  // Get current leaderboard
  const currentLeaderboard = leaderboards[contestId];
  const leaderboardData = currentLeaderboard?.data || [];
  const userPosition = currentLeaderboard?.userPosition;

  // Fetch leaderboard on mount
  useEffect(() => {
    if (contestId) {
      dispatch(fetchContestLeaderboard({ 
        contestId, 
        params: { type: activeTab === 'top-100' ? 'top100' : activeTab } 
      }));
    }
  }, [dispatch, contestId, activeTab]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto text-[#273470] mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Leaderboard...</h3>
          <p className="text-gray-600">Please wait while we fetch the rankings</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Failed to Load</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchContestLeaderboard({ contestId, params: { type: activeTab } }))}
            className="px-6 py-3 bg-[#273470] hover:bg-[#1e2859] text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}`)}
            className="flex items-center text-gray-600 hover:text-[#273470] transition-colors mb-4"
          >
            <FiChevronLeft size={20} className="mr-1" />
            Back to Match
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiAward className="text-[#273470]" size={36} />
                <h1 className="text-4xl font-extrabold text-gray-800">Leaderboard</h1>
              </div>
              <p className="text-gray-600 text-lg">Compete for the top spot and win amazing prizes!</p>
            </div>
            
            <div className="text-center bg-gradient-to-br from-[#273470]/10 to-[#273470]/20 rounded-2xl p-4 border border-[#273470]/30">
              <FiAward className="mx-auto text-[#273470] mb-2" size={32} />
              <p className="text-3xl font-bold text-gray-800">{currentLeaderboard?.prizePool || '$5,000'}</p>
              <p className="text-sm text-gray-600">Prize Pool</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* User's Rank Card (Pinned) */}
        {userPosition && (
          <div className="mb-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <p className="text-gray-600 text-sm mb-3 font-semibold">YOUR POSITION</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getRankColor(userPosition.rank)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-2xl">{getRankIcon(userPosition.rank)}</span>
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-lg">{userPosition.user?.username || 'Player_15'}</p>
                  <p className="text-gray-500 text-sm">{userPosition.fantasyTeam?.name || 'Team 15'}</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-[#273470]">{userPosition.points || 1120}</p>
                <p className="text-gray-500 text-sm">Points</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#273470] mb-1">
                  <FiShield size={16} />
                  <span className="text-gray-800 text-sm font-semibold">{userPosition.fantasyTeam?.captain?.name || 'Virat Kohli'}</span>
                </div>
                <p className="text-gray-500 text-xs">Captain</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#273470] mb-1">
                  <FiStar size={16} />
                  <span className="text-gray-800 text-sm font-semibold">{userPosition.fantasyTeam?.viceCaptain?.name || 'Jasprit Bumrah'}</span>
                </div>
                <p className="text-gray-500 text-xs">Vice Captain</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team`)}
                  className="bg-[#273470] hover:bg-[#1e2859] text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md"
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
                    ? "bg-[#273470] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          {/* Table Header */}
          <div className="bg-[#273470] px-6 py-4">
            <div className="grid grid-cols-5 gap-4 text-white font-semibold text-sm">
              <div>RANK & PLAYER</div>
              <div className="text-center">TEAM NAME</div>
              <div className="text-center">POINTS</div>
              <div className="text-center">CAPTAIN</div>
              <div className="text-center">VICE CAPTAIN</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {leaderboardData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">No participants yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to join this contest!</p>
              </div>
            ) : (
              leaderboardData.map((entry, index) => {
                const rank = entry.rank || index + 1;
                const isTopThree = rank <= 3;
                const isUser = entry.isCurrentUser;
                
                return (
                  <div
                    key={entry._id || index}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      isUser ? "bg-[#273470]/10 border-l-4 border-[#273470]" : ""
                    } ${
                      isTopThree ? "bg-gradient-to-r from-[#273470]/5 to-[#273470]/10" : ""
                    }`}
                  >
                    <div className="grid grid-cols-5 gap-4 items-center">
                      {/* Rank & Username */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getRankColor(rank)} flex items-center justify-center shadow-md`}>
                          <span className="text-white font-bold text-lg">
                            {getRankIcon(rank)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-800 font-semibold">{entry.user?.username || `Player_${rank}`}</p>
                            {isUser && (
                              <span className="px-2 py-0.5 bg-[#273470] text-white text-xs rounded-full font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Team Name */}
                      <div className="text-center">
                        <p className="text-gray-700 font-medium">{entry.fantasyTeam?.name || `Team ${rank}`}</p>
                      </div>

                      {/* Points */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-[#273470]/10 px-4 py-2 rounded-lg border border-[#273470]/30">
                          <FiTrendingUp className="text-green-500" size={16} />
                          <span className="text-gray-800 font-bold text-lg">{entry.points || 0}</span>
                        </div>
                      </div>

                      {/* Captain */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 text-[#273470]">
                          <FiShield size={14} />
                          <span className="text-gray-700 text-sm">{entry.fantasyTeam?.captain?.name || 'TBA'}</span>
                        </div>
                      </div>

                      {/* Vice Captain */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 text-[#273470]">
                          <FiStar size={14} />
                          <span className="text-gray-700 text-sm">{entry.fantasyTeam?.viceCaptain?.name || 'TBA'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Prize Distribution */}
        {currentLeaderboard?.prizeDistribution && (
          <div className="mt-8 bg-gradient-to-br from-[#273470]/10 to-[#273470]/20 rounded-2xl p-6 border border-[#273470]/30">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FiAward className="mr-3 text-[#273470]" size={28} />
              Prize Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentLeaderboard.prizeDistribution.slice(0, 3).map((prize, index) => {
                const position = index + 1;
                const borderColor = position === 1 ? 'border-yellow-400' : position === 2 ? 'border-gray-400' : 'border-orange-400';
                const textColor = position === 1 ? 'text-yellow-600' : position === 2 ? 'text-gray-600' : 'text-orange-600';
                const emoji = position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉';
                
                return (
                  <div key={position} className={`bg-white rounded-xl p-4 text-center border-2 ${borderColor} shadow-md`}>
                    <div className="text-4xl mb-2">{emoji}</div>
                    <p className={`text-2xl font-bold ${textColor}`}>${prize.amount}</p>
                    <p className="text-gray-600 text-sm">{prize.position} Place</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
