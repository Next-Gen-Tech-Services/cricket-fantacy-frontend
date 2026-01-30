import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiAward, FiTrendingUp, FiUser, FiShield, FiStar, FiLoader, FiAlertCircle, FiEye, FiBarChart2 } from "react-icons/fi";
import { fetchMatchLeaderboard } from "../store/slices/matchesSlice";
import FantasyTeamDetail from "../components/FantasyTeamDetail";
import MatchStatsOverview from "../components/MatchStatsOverview";
import useMatchFantasyTeams from "../hooks/useMatchFantasyTeams";

const Leaderboard = () => {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overall");
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  // Get fantasy teams for this match
  const { teams: matchFantasyTeams, loading: teamsLoading } = useMatchFantasyTeams(matchId);

  // Redux state
  const {
    leaderboards,
    loading,
    error,
    currentMatch
  } = useSelector((state) => state.matches);

  // Get current leaderboard
  const currentLeaderboard = leaderboards[matchId];
  const leaderboardData = currentLeaderboard?.data || [];
  const userPosition = currentLeaderboard?.userPosition;

  // Find selected team details - check both matchFantasyTeams and leaderboard data
  const selectedTeam = selectedTeamId
    ? (matchFantasyTeams.find(team => team._id === selectedTeamId) ||
      leaderboardData.find(entry => entry.team?.id === selectedTeamId)?.team)
    : null;

  // Fetch leaderboard on mount
  useEffect(() => {
    if (matchId) {
      dispatch(fetchMatchLeaderboard({
        matchId,
        params: { type: activeTab === 'top-100' ? 'top100' : activeTab }
      }));
    }
  }, [dispatch, matchId, activeTab]);

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
            onClick={() => dispatch(fetchMatchLeaderboard({ matchId, params: { type: activeTab } }))}
            className="px-6 py-3 bg-[#273470] hover:bg-[#1e2859] text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] rounded-2xl p-5 sm:p-6 mb-4 sm:mb-6 text-white shadow-xl">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}`)}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-4 text-sm"
          >
            <FiChevronLeft size={18} className="mr-1" />
            Back to Match
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-col gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiAward className="text-white" size={14} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">Leaderboard</h1>
                    <p className="text-white/80 text-base mt-2">Compete for the top spot and win amazing prizes!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Pool Card */}
            {/* <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 text-center lg:flex-shrink-0">
              <FiAward className="mx-auto text-yellow-400 mb-2" size={24} />
              <p className="text-2xl font-bold text-white">{currentLeaderboard?.prizePool }</p>
              <p className="text-xs text-white/80 font-medium uppercase tracking-wide">Prize Pool</p>
            </div> */}
          </div>
        </div>

        {/* User's Rank Card (Pinned) */}
        {userPosition && (
          <div className="mb-6 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-600 text-sm mb-3 font-bold uppercase tracking-wide">YOUR TEAM</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getRankColor(userPosition.rank)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-2xl">{getRankIcon(userPosition.rank)}</span>
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-xl">{userPosition.teamName || userPosition.fantasyTeam?.name || 'My Team'}</p>
                  <p className="text-gray-500 text-sm">Rank #{userPosition.rank}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-[#273470]">{userPosition.totalFantasyPoints || userPosition.points || 1120}</p>
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
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#273470] font-bold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-yellow-300"
                >
                  Edit Team
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {["overall", "top-100", "teams", "match-stats"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 whitespace-nowrap mb-2 ${activeTab === tab
                  ? "bg-gradient-to-r from-[#273470] to-[#1e2859] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100"
                }`}
            >
              {tab === "teams" ? "MatchPlay Teams" : 
               tab === "match-stats" ? "Match Stats" :
               tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "match-stats" ? (
          /* Match Statistics View */
          <div>
            <MatchStatsOverview matchId={matchId} />
          </div>
        ) : activeTab === "teams" ? (
          /* Fantasy Teams View */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">MatchPlay Teams for this Match</h3>
                <p className="text-gray-600">{matchFantasyTeams.length} teams</p>
              </div>

              {teamsLoading ? (
                <div className="text-center py-8">
                  <FiLoader className="animate-spin mx-auto text-[#273470] mb-2" size={32} />
                  <p className="text-gray-600">Loading teams...</p>
                  <p className="text-gray-400 text-sm mt-1">Match ID: {matchId}</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <FiAlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                  <p className="text-red-600 mb-2">Failed to load fantasy teams</p>
                  <p className="text-gray-500 text-sm mb-2">{error}</p>
                  <p className="text-gray-400 text-xs mb-3">Match ID: {matchId}</p>

                  {error.includes('Not authorized') && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm mb-2">
                        <strong>Note:</strong> Fantasy teams endpoint requires authentication.
                      </p>
                      <p className="text-blue-700 text-sm">
                        Teams shown in the leaderboard above include detailed team information.
                      </p>
                    </div>
                  )}

                  {leaderboardData.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 text-sm mb-1">
                        <strong>Available:</strong> {leaderboardData.length} teams in current contest leaderboard
                      </p>
                      <p className="text-green-700 text-xs">
                        Use the "View Team" button in the leaderboard to see team details
                      </p>
                    </div>
                  )}
                </div>
              ) : matchFantasyTeams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No matchplay teams found for this match</p>
                  <p className="text-gray-400 text-sm mb-3">Match ID: {matchId}</p>

                  {leaderboardData.length > 0 ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm mb-1">
                        <strong>However:</strong> {leaderboardData.length} teams are available in the contest leaderboard
                      </p>
                      <p className="text-blue-700 text-xs">
                        Switch to "Overall" or "Top-100" tab to view teams and use "View Team" for details
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Teams will appear here once created for this specific match</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchFantasyTeams.map((team) => (
                    <div
                      key={team._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedTeamId(team._id);
                        setShowTeamDetails(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 line-clamp-1">
                          {team.teamName || team.name || `Team ${team._id?.slice(-4)}`}
                        </h4>
                        <FiEye className="text-[#273470] flex-shrink-0" size={18} />
                      </div>
                      
                      {/* Match Info */}
                      {team.match?.name && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                          {team.match.name}
                        </p>
                      )}
                      
                      {/* Team Stats */}
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-600">
                          CLG Ptss: <span className="font-bold">{team.totalFantasyPoints || team.performance?.points || 0}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Credits: <span className="font-bold">{team.totalCreditsUsed || 0}/100</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Players: <span className="font-bold">{team.players?.length || 0}/11</span>
                        </p>
                      </div>
                      
                      {/* Captain & Vice Captain */}
                      {(team.captain || team.viceCaptain) && (
                        <div className="space-y-1 mb-3 text-xs">
                          {team.captain && (
                            <p className="text-gray-600">
                              <FiShield className="inline mr-1" size={12} />
                              C: <span className="font-medium">{team.captain.player?.shortName || team.captain.player?.name || 'Unknown'}</span>
                            </p>
                          )}
                          {team.viceCaptain && (
                            <p className="text-gray-600">
                              <FiStar className="inline mr-1" size={12} />
                              VC: <span className="font-medium">{team.viceCaptain.player?.shortName || team.viceCaptain.player?.name || 'Unknown'}</span>
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Status & Validation */}
                      <div className="flex items-center justify-between">
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          team.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          team.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                          team.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          team.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {team.status || 'DRAFT'}
                        </div>
                        
                        {team.isValid !== undefined && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            team.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {team.isValid ? '✓ Valid' : '✗ Invalid'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Leaderboard Table */
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Table Header - Desktop */}
            <div className="hidden md:block bg-gradient-to-r from-[#273470] to-[#1e2859] px-6 py-4">
              <div className="grid gap-6 text-white font-bold text-sm uppercase tracking-wide" style={{gridTemplateColumns: '6% 20% 20% 20% 20%'}}>
                <div className="text-center">RANK</div>
                <div className="text-left pl-2">TEAM NAME</div>
                <div className="text-center">POINTS</div>
                <div className="text-center">CAPTAIN</div>
                <div className="text-center">VICE CAPTAIN</div>
              </div>
            </div>

            {/* Table Header - Mobile */}
            <div className="block md:hidden bg-gradient-to-r from-[#273470] to-[#1e2859] px-4 py-3">
              <h3 className="text-white font-bold text-lg text-center">Leaderboard Rankings</h3>
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
                      className={`px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors ${
                        isUser ? "bg-[#273470]/10 border-l-4 border-[#273470]" : ""
                      } ${
                        isTopThree ? "bg-gradient-to-r from-[#273470]/5 to-[#273470]/10" : ""
                      }`}
                    >
                      {/* Desktop Layout */}
                      <div className="hidden md:grid gap-6 items-center" style={{gridTemplateColumns: '6% 20% 20% 20% 20%'}}>
                        {/* Rank Only */}
                        <div className="flex items-center justify-center">
                          {/* <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getRankColor(rank)} flex items-center justify-center shadow-md`}> */}
                            <span className="text-white font-bold text-sm">
                              {getRankIcon(rank)}
                            </span>
                          {/* </div> */}
                        </div>

                        {/* Team Name */}
                        <div className="text-left px-2">
                          <p className="text-gray-700 font-medium text-sm">{entry.teamName || entry.team?.name || entry.fantasyTeam?.name || `Team ${rank}`}</p>
                        </div>

                        {/* Points */}
                        <div className="text-center">
                          {/* <div className="inline-flex items-center justify-center bg-[#273470]/10 px-3 py-1.5 rounded-lg border border-[#273470]/20">
                            <FiTrendingUp className="text-green-500 mr-1" size={14} /> */}
                            <span className="text-gray-800 font-bold text-base">{entry.totalFantasyPoints || entry.team?.totalPoints || entry.points || 0}</span>
                          {/* </div> */}
                        </div>

                        {/* Captain */}
                        <div className="text-center px-2">
                          <div className="flex items-center justify-center gap-1 text-[#273470]">
                            <FiShield size={12} />
                            <span className="text-gray-700 text-xs font-medium truncate">{entry.players?.find(p => p.role === 'CAPTAIN')?.name || entry.team?.captain?.name || entry.fantasyTeam?.captain?.name || 'TBA'}</span>
                          </div>
                        </div>

                        {/* Vice Captain */}
                        <div className="text-center px-2">
                          <div className="flex items-center justify-center gap-1 text-[#273470]">
                            <FiStar size={12} />
                            <span className="text-gray-700 text-xs font-medium truncate">{entry.players?.find(p => p.role === 'VICE_CAPTAIN')?.name || entry.team?.viceCaptain?.name || entry.fantasyTeam?.viceCaptain?.name || 'TBA'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="block md:hidden">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRankColor(rank)} flex items-center justify-center shadow-md`}>
                              <span className="text-white font-bold text-lg">
                                {getRankIcon(rank)}
                              </span>
                            </div>
                            <div>
                              <p className="text-gray-800 font-bold text-base">{entry.teamName || entry.team?.name || entry.fantasyTeam?.name || `Team ${rank}`}</p>
                              <p className="text-gray-500 text-sm">Rank #{rank}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-[#273470]/10 px-3 py-1.5 rounded-lg border border-[#273470]/30 mb-2">
                              <div className="flex items-center gap-1 justify-center">
                                <FiTrendingUp className="text-green-500" size={12} />
                                <span className="text-gray-800 font-bold text-lg">{entry.totalFantasyPoints || entry.team?.totalPoints || entry.points || 0}</span>
                                {entry.team?.isLiveUpdated && (
                                  <FiActivity className="text-green-500 animate-pulse" size={10} />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">Points</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-gray-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <FiShield className="text-[#273470]" size={12} />
                              <span className="text-xs text-gray-500 font-medium">Captain</span>
                            </div>
                            <p className="text-gray-800 text-xs font-semibold truncate">{entry.players?.find(p => p.role === 'CAPTAIN')?.name || entry.team?.captain?.name || entry.fantasyTeam?.captain?.name || 'TBA'}</p>
                          </div>
                          <div className="bg-gray-50 px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <FiStar className="text-[#273470]" size={12} />
                              <span className="text-xs text-gray-500 font-medium">Vice Captain</span>
                            </div>
                            <p className="text-gray-800 text-xs font-semibold truncate">{entry.players?.find(p => p.role === 'VICE_CAPTAIN')?.name || entry.team?.viceCaptain?.name || entry.fantasyTeam?.viceCaptain?.name || 'TBA'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Team Details Modal */}
        {showTeamDetails && selectedTeam && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Team Details</h2>
                  <button
                    onClick={() => {
                      setShowTeamDetails(false);
                      setSelectedTeamId(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <FantasyTeamDetail
                  team={selectedTeam}
                  showActions={true}
                  onEdit={(team) => {
                    setShowTeamDetails(false);
                    navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team?edit=${team._id}`);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Prize Distribution */}
        {currentLeaderboard?.prizeDistribution && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                <FiAward className="text-yellow-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Prize Distribution
              </h3>
            </div>
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
      </section>
    </main>
  );
};

export default Leaderboard;
