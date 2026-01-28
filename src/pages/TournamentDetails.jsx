import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCalendar, FiMapPin, FiClock, FiChevronLeft, FiAward, FiUsers, FiArrowRight, FiLoader, FiAlertCircle, FiStar, FiTrendingUp } from "react-icons/fi";
import { fetchTournamentById } from "../store/slices/tournamentsSlice";
import { fetchLeaderboard } from "../store/slices/leaderboardSlice";

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("matches"); // New tab state

  // Redux state
  const {
    currentTournament,
    tournamentMatches,
    isLoading,
    error
  } = useSelector((state) => state.tournaments);

  // Leaderboard state
  const {
    leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError
  } = useSelector((state) => state.leaderboard);

  // Fetch tournament data (includes matches) on component mount
  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchTournamentById(tournamentId));
    }
  }, [dispatch, tournamentId]);

  // Fetch tournament leaderboard when tab changes to leaderboard
  useEffect(() => {
    if (tournamentId && activeTab === "leaderboard") {
      dispatch(fetchLeaderboard({ tournamentId }));
    }
  }, [dispatch, tournamentId, activeTab]);

  // Sort and filter matches
  const getSortedMatches = (matches) => {
    if (!matches || matches.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Create a copy of the array before sorting to avoid mutating Redux state
    return [...matches].sort((a, b) => {
      const aDate = new Date(a.startedAt * 1000);
      const bDate = new Date(b.startedAt * 1000);

      // Check if matches are today
      const aIsToday = aDate >= today && aDate < tomorrow;
      const bIsToday = bDate >= today && bDate < tomorrow;

      // Today's matches first
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;

      // If both are today or both are not today, sort by status priority
      const statusPriority = { 'live': 0, 'scheduled': 1, 'upcoming': 1, 'completed': 2 };
      const aPriority = statusPriority[a.status] || 3;
      const bPriority = statusPriority[b.status] || 3;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // Same priority, sort by start time
      return aDate - bDate;
    });
  };

  const sortedMatches = getSortedMatches(tournamentMatches || []);

  const filteredMatches = sortedMatches.filter((match) => {
    if (filterStatus === "all") return true;

    return match.status?.toLowerCase() === (filterStatus =='upcoming' ? 'scheduled' : filterStatus);
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
      case "ongoing":
        return "bg-red-500 text-white animate-pulse";
      case "upcoming":
      case "scheduled":
        return "bg-blue-500 text-white";
      case "completed":
      case "finished":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
      case "ongoing":
        return "LIVE";
      case "upcoming":
      case "scheduled":
        return "UPCOMING";
      case "completed":
      case "finished":
        return "COMPLETED";
      default:
        return status?.toUpperCase() || "UNKNOWN";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";

    let date;
    // Handle both ISO strings and timestamps
    if (typeof dateString === 'number') {
      date = new Date(dateString * 1000); // Convert from seconds to milliseconds
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return "TBD";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "TBD";

    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return "TBD";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return { icon: "🥇", color: "text-yellow-600" };
    if (rank === 2) return { icon: "🥈", color: "text-gray-500" };
    if (rank === 3) return { icon: "🥉", color: "text-orange-600" };
    return { icon: rank, color: "text-gray-700" };
  };

  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#273470] to-[#1e2859] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto text-white mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">Loading Tournament...</h3>
          <p className="text-white/80">Please wait while we fetch tournament details</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-white mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Tournament</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => dispatch(fetchTournamentById(tournamentId))}
              className="px-6 py-2 bg-white text-red-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/tournaments")}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Back to Tournaments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tournament not found
  if (!currentTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#273470] to-[#1e2859] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Tournament Not Found</h2>
          <p className="text-white/80 mb-4">The tournament you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/tournaments")}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-[#273470] rounded-lg transition-colors"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <section className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] rounded-xl p-6 mb-8 text-white shadow-lg">
          <button
            onClick={() => navigate("/tournaments")}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-4 text-sm"
          >
            <FiChevronLeft size={18} className="mr-1" />
            Back to Tournaments
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiAward className="text-white" size={14} />
                </div>
                <h1 className="text-xl md:text-2xl font-bold">{currentTournament.name}</h1>
              </div>
              <p className="text-white/90 text-lg max-w-3xl mb-4">{currentTournament.description}</p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiCalendar className="mr-2 text-white" size={12} />
                  <span className="text-xs font-medium">
                    {formatDate(currentTournament.startDate)} - {formatDate(currentTournament.endDate)}
                  </span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiUsers className="mr-2 text-white" size={12} />
                  <span className="text-xs font-medium">{currentTournament.type || 'Cricket'}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-xs font-medium">{tournamentMatches.length} Matches</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm mb-6 border border-gray-200">
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 px-4 py-3 rounded-md font-semibold text-sm transition-all ${
              activeTab === "matches"
                ? "bg-[#273470] text-white shadow-md"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiCalendar size={16} />
              <span>Matches</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 px-4 py-3 rounded-md font-semibold text-sm transition-all ${
              activeTab === "leaderboard"
                ? "bg-[#273470] text-white shadow-md"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiAward size={16} />
              <span>Leaderboard</span>
            </div>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "matches" && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Matches ({filteredMatches.length})
          </h2>

          <div className="flex flex-wrap gap-2">
            {["all", "live", "upcoming", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filterStatus === status
                    ? "bg-[#273470] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#273470]/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
              onClick={() => navigate(`/tournaments/${tournamentId}/matches/${match.id}`)}
            >
              <div className="p-6">
                {/* Match Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
                    {match.status === "live" && match.currentOver && (
                      <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded-full">Over {match.currentOver}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span className="bg-[#273470] text-white px-2 py-1 rounded font-medium">
                      {match.format.toUpperCase() || match.matchType || 'Cricket'}
                    </span>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center justify-center gap-6 text-gray-600 text-sm mb-5">
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                    <FiCalendar className="mr-2 text-[#273470]" size={14} />
                    <span className="font-medium">{formatDate(match.startedAt)}</span>
                  </div>
                  {match.startedAt && (
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                      <FiClock className="mr-2 text-[#273470]" size={14} />
                      <span className="font-medium">{formatTime(match.startedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Teams - Enhanced Design */}
                <div className="flex items-center justify-between mb-6">
                  {/* Team 1 */}
                  <div className="flex-1 text-center">
                    <div className="flex justify-center mb-2">
                      <span className="text-2xl">🏏</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 leading-tight">
                      {match.teams?.a?.name || match.teams?.a?.code || 'Team A'}
                    </h3>
                    {match.teams?.a?.score && match.status !== "scheduled" && match.status !== "upcoming" && (
                      <p className="text-lg font-bold text-[#273470]">
                        {match.teams?.a?.score}
                      </p>
                    )}
                  </div>

                  {/* VS */}
                  <div className="mx-4">
                    <div className="w-12 h-12 rounded-full bg-[#273470] flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-sm">VS</span>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 text-center">
                    <div className="flex justify-center mb-2">
                      <span className="text-2xl">🏏</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 leading-tight">
                      {match.teams?.b?.name || match.teams?.b?.code || 'Team B'}
                    </h3>
                    {match.teams?.b?.score && match.status !== "scheduled" && match.status !== "upcoming" && (
                      <p className="text-lg font-bold text-[#273470]">
                        {match.teams?.b?.score}
                      </p>
                    )}
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <FiMapPin className="mr-2 text-gray-400" size={14} />
                  <span className="text-sm font-medium text-center">
                    {match.venue?.name ? (
                      <span className="block">
                        <span className="font-semibold">{match.venue.name}</span>
                        {/* {match.venue.city && (
                          <span className="text-gray-500 text-xs block mt-1">
                            {match.venue.city}{match.venue.country?.name && match.venue.city !== match.venue.country.name ? `, ${match.venue.country.name}` : ''}
                          </span>
                        )} */}
                      </span>
                    ) : (
                      match.venue || 'Venue TBA'
                    )}
                  </span>
                </div>

                {/* Match Result or Action */}
                <div className="flex justify-center">
                  {match.status === 'completed' && match.winner ? (
                    <div className="text-green-700 font-semibold text-center bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 rounded-xl w-full text-sm border border-green-200">
                      🏆 {match.winner === 'a' ? match.teams?.a?.name || match.teams?.a?.code :
                        match.winner === 'b' ? match.teams?.b?.name || match.teams?.b?.code :
                          'Match Completed'} Won
                    </div>
                  ) : (
                    <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#273470] to-[#1e2859] hover:from-[#1e2859] hover:to-[#273470] text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg shadow-md w-full">
                      <span className="text-sm">View Details</span>
                      <FiArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMatches.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiCalendar className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {tournamentMatches.length === 0 ? 'No Matches Available' : 'No Matches Found'}
            </h3>
            <p className="text-gray-600">
              {tournamentMatches.length === 0
                ? 'This tournament has no matches scheduled yet. Check back later!'
                : `Try selecting a different filter or check back later. ${filterStatus === 'all' ? '' : `Currently showing only ${filterStatus} matches.`}`
              }
            </p>
            {filterStatus !== 'all' && (
              <button
                onClick={() => setFilterStatus('all')}
                className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Show All Matches
              </button>
            )}
          </div>
        )}
          </>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div>
            {/* Leaderboard Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FiAward className="text-[#273470]" size={28} />
                Tournament Leaderboard
              </h2>
            </div>

            {/* Leaderboard Content */}
            {leaderboardLoading && (
              <div className="text-center py-20">
                <FiLoader className="animate-spin mx-auto text-[#273470] mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Leaderboard...</h3>
                <p className="text-gray-600">Please wait while we fetch the rankings</p>
              </div>
            )}

            {leaderboardError && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Leaderboard</h3>
                <p className="text-gray-600 mb-4">{leaderboardError}</p>
                <button
                  onClick={() => dispatch(fetchLeaderboard({ tournamentId }))}
                  className="px-6 py-3 bg-[#273470] hover:bg-[#1e2859] text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!leaderboardLoading && !leaderboardError && (
              <>
                {leaderboard && leaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {/* Top 3 Podium */}
                    {leaderboard.length >= 3 && (
                      <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] rounded-2xl p-8 mb-8 text-white">
                        <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                          <FiStar className="text-yellow-400" />
                          Top Performers
                        </h3>
                        <div className="flex justify-center items-end gap-6">
                          {/* 2nd Place */}
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                              🥈
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{leaderboard[1]?.user?.name || 'Player 2'}</h4>
                            <p className="text-white/80 text-xs mb-2">{leaderboard[1]?.totalPoints || 0} pts</p>
                            <div className="bg-white/20 px-3 py-1 rounded-full">
                              <span className="text-xs font-bold">#2</span>
                            </div>
                          </div>
                          
                          {/* 1st Place */}
                          <div className="text-center transform scale-110">
                            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto shadow-lg">
                              🥇
                            </div>
                            <h4 className="font-bold text-lg mb-1">{leaderboard[0]?.user?.name || 'Player 1'}</h4>
                            <p className="text-yellow-400 text-sm mb-2 font-semibold">{leaderboard[0]?.totalPoints || 0} pts</p>
                            <div className="bg-yellow-400 text-[#273470] px-4 py-2 rounded-full">
                              <span className="text-sm font-bold">👑 CHAMPION</span>
                            </div>
                          </div>
                          
                          {/* 3rd Place */}
                          <div className="text-center">
                            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                              🥉
                            </div>
                            <h4 className="font-semibold text-sm mb-1">{leaderboard[2]?.user?.name || 'Player 3'}</h4>
                            <p className="text-white/80 text-xs mb-2">{leaderboard[2]?.totalPoints || 0} pts</p>
                            <div className="bg-white/20 px-3 py-1 rounded-full">
                              <span className="text-xs font-bold">#3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Full Leaderboard */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <FiTrendingUp className="text-[#273470]" size={20} />
                          <h3 className="text-lg font-bold text-gray-800">Complete Rankings</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {leaderboard.map((entry, index) => {
                            const rankDisplay = getRankDisplay(entry.rank || index + 1);
                            return (
                              <div
                                key={entry._id || index}
                                className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md ${
                                  index < 3 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index < 3 ? 'bg-white shadow-md' : 'bg-white'} ${rankDisplay.color}`}>
                                    {rankDisplay.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800">
                                      {entry.user?.name || `Player ${index + 1}`}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {entry.teamsCount || 0} teams • Avg: {entry.averagePoints?.toFixed(1) || '0.0'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg text-[#273470]">
                                    {entry.totalPoints?.toLocaleString() || '0'}
                                  </p>
                                  <p className="text-sm text-gray-500">points</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FiAward className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Rankings Yet</h3>
                    <p className="text-gray-600">
                      Tournament leaderboard will be updated as matches are played. Come back after the tournament starts!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default TournamentDetails;
