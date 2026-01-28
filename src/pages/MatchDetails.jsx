import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiAward, FiUsers, FiClock, FiMapPin, FiShield, FiLoader, FiAlertCircle, FiTrendingUp, FiStar, FiBarChart2, FiEdit } from "react-icons/fi";
import { fetchMatchById } from "../store/slices/matchesSlice";
import { fetchMyFantasyTeams } from "../store/slices/fantasyTeamsSlice";

const MatchDetails = () => {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const {
    currentMatch,
    isLoading,
    error
  } = useSelector((state) => state.matches);

  const { teams: userFantasyTeams } = useSelector((state) => state.fantasyTeams);

  // Fetch match data on component mount
  useEffect(() => {
    if (matchId) {
      dispatch(fetchMatchById(matchId));
    }
  }, [dispatch, matchId]);

  // Fetch user's fantasy teams - refetch whenever location changes (e.g., navigating back from create-team)
  useEffect(() => {
    if (tournamentId) {
      dispatch(fetchMyFantasyTeams({ tournament: tournamentId }));
    }
  }, [dispatch, tournamentId, location.pathname]);

  // Helper function to check if user has created a team for this match
  const hasTeamForMatch = () => {
    if (!Array.isArray(userFantasyTeams)) return false;
    return userFantasyTeams.some(team => {
      // Handle match as string ID or populated object with id or _id
      const teamMatchId = typeof team.match === 'string'
        ? team.match
        : (team.match?.id || team.match?._id);
      return teamMatchId === matchId;
    });
  };

  // Get team for this match
  const getTeamForMatch = () => {
    if (!Array.isArray(userFantasyTeams)) return null;
    return userFantasyTeams.find(team => {
      // Handle match as string ID or populated object with id or _id
      const teamMatchId = typeof team.match === 'string'
        ? team.match
        : (team.match?.id || team.match?._id);
      return teamMatchId === matchId;
    });
  };

  // Helper functions
  const formatDate = (timestamp) => {
    if (!timestamp) return 'TBA';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'TBA';
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      case 'scheduled':
      case 'upcoming': return 'bg-blue-500';
      case 'cancelled':
      case 'postponed': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'live': return 'LIVE';
      case 'completed': return 'COMPLETED';
      case 'scheduled':
      case 'upcoming': return 'UPCOMING';
      case 'cancelled': return 'CANCELLED';
      case 'postponed': return 'POSTPONED';
      default: return status?.toUpperCase() || 'UPCOMING';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto text-[#273470] mb-4" size={48} />
          <h3 className="text-xl font-semibold text-[#273470] mb-2">Loading Match Details...</h3>
          <p className="text-gray-600">Please wait while we fetch the match information</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentMatch) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-[#273470] mb-4" size={48} />
          <h2 className="text-3xl font-bold text-[#273470] mb-4">Match Not Found</h2>
          <p className="text-gray-600 mb-4">The match you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
            className="px-6 py-3 bg-[#273470] hover:bg-[#1e2859] text-white rounded-lg transition-colors"
          >
            Back to Tournament
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/*  Header */}
        <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] rounded-2xl p-5 sm:p-6 mb-4 sm:mb-6 text-white shadow-xl">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-4 text-sm"
          >
            <FiChevronLeft size={18} className="mr-1" />
            Back to Tournaments
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-col gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiAward className="text-white" size={14} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight">{currentMatch.name}</h1>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                <div className="flex items-center bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                  <FiClock className="mr-3 text-yellow-400 flex-shrink-0" size={18} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Match Time</span>
                    <span className="text-sm font-bold text-white truncate">
                      {formatDate(currentMatch.startedAt)}
                    </span>
                    <span className="text-xs text-white/90 font-medium">
                      {formatTime(currentMatch.startedAt)}
                    </span>
                  </div>
                </div>
                {currentMatch.venue?.name && (
                  <div className="flex items-center bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                    <FiMapPin className="mr-3 text-green-400 flex-shrink-0" size={18} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Venue</span>
                      <span className="text-sm font-bold text-white truncate">
                        {currentMatch.venue.name}
                      </span>
                      {currentMatch.venue.city && (
                        <span className="text-xs text-white/90 font-medium">
                          {currentMatch.venue.city}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex items-center bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
                  <FiShield className="mr-3 text-blue-400 flex-shrink-0" size={18} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-white/80 font-medium uppercase tracking-wide">Format</span>
                    <span className="text-sm font-bold text-white">{currentMatch.format.toUpperCase() || 'Cricket'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              {(currentMatch.status === 'scheduled' || currentMatch.status === 'upcoming') && (
                <>
                  {hasTeamForMatch() ? (
                    <button
                      onClick={() => {
                        const team = getTeamForMatch();
                        navigate(`/tournaments/${tournamentId}/matches/${matchId}/edit-team/${team._id}`);
                      }}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#273470] font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-sm lg:text-base border border-yellow-300"
                    >
                      <FiEdit size={18} className="flex-shrink-0" />
                      <span className="font-semibold">Edit Team</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team`)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#273470] font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-sm lg:text-base border border-yellow-300"
                    >
                      <FiUsers size={18} className="flex-shrink-0" />
                      <span className="font-semibold">Create Team</span>
                    </button>
                  )}

                </>
              )}
              {
                (currentMatch.status === 'live' || currentMatch.status === 'scheduled') && (

                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-sm lg:text-base"
                  >
                    <FiAward size={18} className="flex-shrink-0" />
                    <span className="font-semibold">Leaderboard</span>
                  </button>
                )
              }
              {currentMatch.status === 'completed' && (
                <button
                  onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-sm lg:text-base border border-green-500"
                >
                  <FiAward size={18} className="flex-shrink-0" />
                  <span className="font-semibold">Final Results</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Teams Section with Enhanced Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Team A */}
          <div className="bg-white border-0 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🏏</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                {currentMatch.teams?.a?.name || currentMatch.teams?.a?.code || 'Team A'}
              </h3>
              {currentMatch.teams?.a?.score && currentMatch.status !== "scheduled" && currentMatch.status !== "upcoming" && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 mb-4 shadow-md">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{currentMatch.teams.a.score}</p>
                  <p className="text-blue-100 text-sm font-medium mt-1">Score</p>
                </div>
              )}
            </div>
          </div>

          {/* VS Section Enhanced */}
          <div className="bg-white border-0 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg mx-auto mb-4">
                <span className="text-white font-bold text-xl sm:text-2xl drop-shadow-sm">VS</span>
              </div>

              {/* Match Status */}
              <div className="bg-gray-50 rounded-xl p-3 mx-2">
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Match Status</p>
                <p className="font-semibold">
                  {currentMatch.status === 'completed' && currentMatch.winner ? (
                    <span className="text-green-600 font-bold">
                      {currentMatch.winner === 'a'
                        ? currentMatch.teams?.a?.name || 'Team A'
                        : currentMatch.teams?.b?.name || 'Team B'} Won
                    </span>
                  ) : currentMatch.status === 'live' ? (
                    <span className="text-red-500 font-bold animate-pulse">🔴 LIVE MATCH</span>
                  ) : (
                    <span className="text-[#273470] font-semibold">⏰ Upcoming</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white border-0 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🏏</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                {currentMatch.teams?.b?.name || currentMatch.teams?.b?.code || 'Team B'}
              </h3>
              {currentMatch.teams?.b?.score && currentMatch.status !== "scheduled" && currentMatch.status !== "upcoming" && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 mb-4 shadow-md">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{currentMatch.teams.b.score}</p>
                  <p className="text-red-100 text-sm font-medium mt-1">Score</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Insights & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Match Facts */}
          <div className="bg-white border-0 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mr-3">
                <FiBarChart2 className="text-yellow-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Match Facts
              </h3>
            </div>
            <div className="space-y-3">
              {currentMatch.matchType && (
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 rounded-xl">
                  <span className="text-gray-600 font-medium text-sm">Match Type</span>
                  <span className="font-bold text-gray-800 text-sm">{currentMatch.matchType}</span>
                </div>
              )}
              {currentMatch.series && (
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 rounded-xl">
                  <span className="text-gray-600 font-medium text-sm">Series</span>
                  <span className="font-bold text-gray-800 text-sm">{currentMatch.series}</span>
                </div>
              )}
              {currentMatch.tossWinner && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 border-0 rounded-xl gap-1 sm:gap-0">
                  <span className="text-gray-600 font-medium text-sm">Toss Winner</span>
                  <span className="font-bold text-gray-800 text-sm">{currentMatch.tossWinner} (Elected to {currentMatch.tossChoice || 'TBA'})</span>
                </div>
              )}
              {!currentMatch.tossWinner && (currentMatch.status === 'scheduled' || currentMatch.status === 'upcoming') && (
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 rounded-xl">
                  <span className="text-gray-600 font-medium text-sm">Toss</span>
                  <span className="font-bold text-gray-800 text-sm">Yet to happen</span>
                </div>
              )}
              {currentMatch.venue && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 border-0 rounded-xl gap-1 sm:gap-0">
                  <span className="text-gray-600 font-medium text-sm">Venue</span>
                  <span className="font-bold text-gray-800 text-sm">
                    {currentMatch.venue.name}
                    {currentMatch.venue.city && `, ${currentMatch.venue.city}`}
                  </span>
                </div>
              )}
              {currentMatch.fantasyEnabled !== undefined && (
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 rounded-xl">
                  <span className="text-gray-600 font-medium text-sm">Fantasy</span>
                  <span className={`font-bold text-sm ${currentMatch.fantasyEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {currentMatch.fantasyEnabled ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Performances */}
          <div className="bg-white border-0 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                <FiTrendingUp className="text-green-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Recent Performances
              </h3>
            </div>
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{currentMatch.teams?.a?.name || 'Team A'}</h4>
                <div className="space-y-2">
                  {currentMatch.teams?.a?.recentMatches?.length > 0 ? (
                    currentMatch.teams.a.recentMatches.slice(0, 3).map((match, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-white rounded-lg p-3">
                        <span className="text-gray-600 font-medium">vs {match.opponent}</span>
                        <span className={`font-bold px-2 py-1 rounded-full text-xs ${match.result === 'W' ? 'text-green-700 bg-green-100' :
                          match.result === 'L' ? 'text-red-700 bg-red-100' :
                            'text-gray-700 bg-gray-100'
                          }`}>
                          {match.resultText || match.result}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 bg-white rounded-lg p-3 text-center">Recent match data not available</div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-3 text-sm">{currentMatch.teams?.b?.name || 'Team B'}</h4>
                <div className="space-y-2">
                  {currentMatch.teams?.b?.recentMatches?.length > 0 ? (
                    currentMatch.teams.b.recentMatches.slice(0, 3).map((match, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-white rounded-lg p-3">
                        <span className="text-gray-600 font-medium">vs {match.opponent}</span>
                        <span className={`font-bold px-2 py-1 rounded-full text-xs ${match.result === 'W' ? 'text-green-700 bg-green-100' :
                          match.result === 'L' ? 'text-red-700 bg-red-100' :
                            'text-gray-700 bg-gray-100'
                          }`}>
                          {match.resultText || match.result}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 bg-white rounded-lg p-3 text-center">Recent match data not available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MatchDetails;
