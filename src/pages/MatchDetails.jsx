import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronLeft, FiAward, FiUsers, FiClock, FiMapPin, FiShield, FiLoader, FiAlertCircle, FiTrendingUp, FiStar, FiBarChart2 } from "react-icons/fi";
import { fetchMatchById } from "../store/slices/matchesSlice";

const MatchDetails = () => {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const {
    currentMatch,
    isLoading,
    error
  } = useSelector((state) => state.matches);

  // Fetch match data on component mount
  useEffect(() => {
    if (matchId) {
      dispatch(fetchMatchById(matchId));
    }
  }, [dispatch, matchId]);

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
    <main className="min-h-screen bg-white">
      <section className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] rounded-xl p-6 mb-8 text-white shadow-lg">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
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
                <h1 className="text-3xl md:text-4xl font-bold">{currentMatch.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(currentMatch.status)}`}>
                  {getStatusText(currentMatch.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiClock className="mr-2 text-white" size={16} />
                  <span className="text-sm font-medium">
                    {formatDate(currentMatch.startedAt)} • {formatTime(currentMatch.startedAt)}
                  </span>
                </div>
                {currentMatch.venue?.name && (
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <FiMapPin className="mr-2 text-white" size={16} />
                    <span className="text-sm font-medium">
                      {currentMatch.venue.name}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {(currentMatch.status === 'scheduled' || currentMatch.status === 'upcoming') && (
                <>
                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-[#273470] font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiUsers size={18} />
                    Create Your Team
                  </button>
                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiAward size={18} />
                    View Leaderboard
                  </button>
                </>
              )}
              {currentMatch.status === 'completed' && (
                <button
                  onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <FiAward size={18} />
                  View Final Results
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Teams Section with Enhanced Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Team A */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <span className="text-4xl">🏏</span>
              </div>
              <h3 className="text-2xl font-bold text-[#273470] mb-2">
                {currentMatch.teams?.a?.name || currentMatch.teams?.a?.code || 'Team A'}
              </h3>
              {currentMatch.teams?.a?.score && currentMatch.status !== "scheduled" && currentMatch.status !== "upcoming" && (
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <p className="text-3xl font-bold text-white">{currentMatch.teams.a.score}</p>
                </div>
              )}


            </div>
          </div>

          {/* VS Section Enhanced */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg mx-auto mb-4">
                <span className="text-[#273470] font-bold text-2xl">VS</span>
              </div>

              {/* Match Status */}
              <p className="text-gray-600 text-sm font-medium mb-4">
                {currentMatch.status === 'completed' && currentMatch.winner ? (
                  <span className="text-green-600 font-bold">
                    {currentMatch.winner === 'a'
                      ? currentMatch.teams?.a?.name || 'Team A'
                      : currentMatch.teams?.b?.name || 'Team B'} Won
                  </span>
                ) : currentMatch.status === 'live' ? (
                  <span className="text-red-600 font-bold animate-pulse">LIVE MATCH</span>
                ) : (
                  <span className="text-[#273470]">Upcoming Match</span>
                )}
              </p>

            </div>
          </div>

          {/* Team B */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <span className="text-4xl">🏏</span>
              </div>
              <h3 className="text-2xl font-bold text-[#273470] mb-2">
                {currentMatch.teams?.b?.name || currentMatch.teams?.b?.code || 'Team B'}
              </h3>
              {currentMatch.teams?.b?.score && currentMatch.status !== "scheduled" && currentMatch.status !== "upcoming" && (
                <div className="bg-[#273470] rounded-lg p-3 mb-4">
                  <p className="text-3xl font-bold text-white">{currentMatch.teams.b.score}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Insights & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Match Facts */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#273470] mb-4 flex items-center">
              <FiBarChart2 className="mr-2 text-yellow-500" />
              Match Facts
            </h3>
            <div className="space-y-4">
              {currentMatch.matchType && (
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-600">Match Type:</span>
                  <span className="font-semibold text-[#273470]">{currentMatch.matchType}</span>
                </div>
              )}
              {currentMatch.series && (
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-600">Series:</span>
                  <span className="font-semibold text-[#273470]">{currentMatch.series}</span>
                </div>
              )}
              {currentMatch.tossWinner && (
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-600">Toss Winner:</span>
                  <span className="font-semibold text-[#273470]">{currentMatch.tossWinner} (Elected to {currentMatch.tossChoice || 'TBA'})</span>
                </div>
              )}
              {!currentMatch.tossWinner && (currentMatch.status === 'scheduled' || currentMatch.status === 'upcoming') && (
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-600">Toss:</span>
                  <span className="font-semibold text-[#273470]">Yet to happen</span>
                </div>
              )}
              {currentMatch.venue && (
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-semibold text-[#273470]">
                    {currentMatch.venue.name}
                    {currentMatch.venue.city && `, ${currentMatch.venue.city}`}
                  </span>
                </div>
              )}
              {currentMatch.fantasyEnabled !== undefined && (
                <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-600">Fantasy:</span>
                  <span className={`font-semibold ${currentMatch.fantasyEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {currentMatch.fantasyEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Performances */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#273470] mb-4 flex items-center">
              <FiTrendingUp className="mr-2 text-yellow-500" />
              Recent Performances
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#273470] mb-2">{currentMatch.teams?.a?.name || 'Team A'}</h4>
                <div className="space-y-2">
                  {currentMatch.teams?.a?.recentMatches?.length > 0 ? (
                    currentMatch.teams.a.recentMatches.slice(0, 3).map((match, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">vs {match.opponent}</span>
                        <span className={`font-semibold ${match.result === 'W' ? 'text-green-600' : match.result === 'L' ? 'text-red-600' : 'text-gray-600'}`}>
                          {match.resultText || match.result}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Recent match data not available</div>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h4 className="font-semibold text-[#273470] mb-2">{currentMatch.teams?.b?.name || 'Team B'}</h4>
                <div className="space-y-2">
                  {currentMatch.teams?.b?.recentMatches?.length > 0 ? (
                    currentMatch.teams.b.recentMatches.slice(0, 3).map((match, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">vs {match.opponent}</span>
                        <span className={`font-semibold ${match.result === 'W' ? 'text-green-600' : match.result === 'L' ? 'text-red-600' : 'text-gray-600'}`}>
                          {match.resultText || match.result}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">Recent match data not available</div>
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
