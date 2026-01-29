import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLoader, FiAlertCircle, FiEdit, FiEye } from "react-icons/fi";
import { fetchMyFantasyTeams } from "../store/slices/fantasyTeamsSlice";

export default function Teams() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Get fantasy teams from Redux store
  const { teams, isLoading, error } = useSelector((state) => state.fantasyTeams);

  // Fetch teams on component mount
  useEffect(() => {
    console.log('🚀 Teams component: Loading fantasy teams...');
    dispatch(fetchMyFantasyTeams());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchMyFantasyTeams()).unwrap();
    } catch (err) {
      console.error('Failed to refresh teams:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditTeam = (team) => {
    if (team.match?.id) {
      navigate(`/tournaments/${team.tournament?.id}/matches/${team.match.id}/create-team?edit=${team._id}`);
    } else {
      // Fallback for teams without match info
      navigate(`/create-team?edit=${team._id}`);
    }
  };

  const handlePreviewTeam = (team) => {
    // Navigate to team detail or create a modal view
    console.log('Preview team:', team);
    // You can implement a detailed view or modal here
  };

  const formatTeamName = (team) => {
    return team.teamName || team.name || `Team ${team._id?.slice(-4)}`;
  };

  const getTeamStatus = (team) => {
    return team.status || 'DRAFT';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="px-4 py-10 space-y-10 bg-main">
      {/* ================= HEADER ================= */}
      <section className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Teams</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your matchplay teams for upcoming matches
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading || refreshing}
            className="btn-outline px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <FiLoader className={`${isLoading || refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/create-team")}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            + Create Team
          </button>
        </div>
      </section>

      {/* ================= TEAMS CONTENT ================= */}
      <section className="max-w-[1440px] mx-auto">
        {/* Loading State */}
        {isLoading && teams.length === 0 && (
          <div className="text-center py-12">
            <FiLoader className="animate-spin mx-auto text-[#273470] mb-4" size={48} />
            <p className="text-gray-600 text-lg">Loading your fantasy teams...</p>
            <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-red-600 text-lg mb-2">Failed to load teams</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="btn-primary px-6 py-3 rounded-lg text-sm font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && teams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">No fantasy teams yet</p>
            <p className="text-gray-400 text-sm mb-6">Create your first team to get started!</p>
            <button
              onClick={() => navigate("/create-team")}
              className="btn-primary px-6 py-3 rounded-lg text-sm font-semibold"
            >
              Create Your First Team
            </button>
          </div>
        )}

        {/* Teams Grid */}
        {!isLoading && teams.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team._id || team.id}
                className="app-card p-6 space-y-4 hover:-translate-y-1 transition-all duration-200"
              >
                {/* TOP */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-primary line-clamp-1">
                      {formatTeamName(team)}
                    </h2>
                    <p className="text-xs text-secondary mt-1">
                      {team.tournament?.name || team.match?.name || 'Fantasy Team'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-secondary">
                      {team.players?.length || 11} Players
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(getTeamStatus(team))}`}>
                      {getTeamStatus(team)}
                    </span>
                  </div>
                </div>

                {/* MATCH INFO */}
                {team.match && (
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <p className="text-xs text-gray-600 mb-1">Match</p>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {team.match.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {team.match.status || 'upcoming'}
                    </p>
                  </div>
                )}

                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Captain</p>
                    <p className="font-semibold text-primary line-clamp-1">
                      {team.captain?.player?.name || team.captain?.name || 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted">Vice Captain</p>
                    <p className="font-semibold text-primary line-clamp-1">
                      {team.viceCaptain?.player?.name || team.viceCaptain?.name || 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted">Credits Used</p>
                    <p className="font-semibold text-primary">
                      {team.totalCreditsUsed || team.creditsUsed || 0}/100
                    </p>
                  </div>

                  <div>
                    <p className="text-muted">Points</p>
                    <p className="font-semibold text-primary">
                      {team.totalFantasyPoints || team.points || 0}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => handlePreviewTeam(team)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold btn-outline flex items-center justify-center gap-2"
                  >
                    <FiEye size={16} />
                    Preview
                  </button>

                  <button 
                    onClick={() => handleEditTeam(team)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold btn-primary flex items-center justify-center gap-2"
                  >
                    <FiEdit size={16} />
                    Edit Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
