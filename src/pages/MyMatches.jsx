import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaUsers, FaCalendarAlt, FaEye, FaClock } from 'react-icons/fa';
import { useGetUserMatchesQuery } from '../api/userApi';
import { HorizontalBannerMedium } from '../components/ads';
import LoadingSpinner from '../components/LoadingSpinner';

const MyMatches = () => {
  const [filter, setFilter] = useState('all'); // all, live, completed, upcoming
  const { data: userMatches, isLoading, error } = useGetUserMatchesQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Matches</h2>
          <p className="text-gray-600">{error.message || 'Failed to load your matches'}</p>
        </div>
      </div>
    );
  }

  const matches = userMatches?.data?.matches || [];

  const getFilteredMatches = () => {
    if (filter === 'all') return matches;
    return matches.filter(match => {
      const now = new Date();
      const matchStart = new Date(match.startDate);
      const matchEnd = new Date(match.endDate);
      
      switch (filter) {
        case 'live':
          return now >= matchStart && now <= matchEnd;
        case 'completed':
          return now > matchEnd;
        case 'upcoming':
          return now < matchStart;
        default:
          return true;
      }
    });
  };

  const filteredMatches = getFilteredMatches();

  const getMatchStatus = (match) => {
    const now = new Date();
    const matchStart = new Date(match.startDate);
    const matchEnd = new Date(match.endDate);
    
    if (now < matchStart) return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (now >= matchStart && now <= matchEnd) return { status: 'live', color: 'text-green-600', bg: 'bg-green-100' };
    return { status: 'completed', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-main">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Matches</h1>
          <p className="text-slate-600">Track your fantasy cricket match participation and performance</p>
        </div>

        {/* Ad Banner */}
        {/* <HorizontalBannerMedium className="mb-8" /> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">{matches.length}</div>
            <div className="text-sm text-slate-600">Total Matches</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-green-600">
              {matches.filter(m => getMatchStatus(m).status === 'live').length}
            </div>
            <div className="text-sm text-slate-600">Live Matches</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">
              {matches.filter(m => getMatchStatus(m).status === 'upcoming').length}
            </div>
            <div className="text-sm text-slate-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-slate-600">
              {matches.filter(m => getMatchStatus(m).status === 'completed').length}
            </div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All Matches' },
            { key: 'live', label: 'Live' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              style={filter === tab.key ? { backgroundColor: '#273470' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200">
            <div className="text-slate-400 mb-4">
              <FaTrophy size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No matches found</h3>
            <p className="text-slate-600 mb-4">
              {filter === 'all' 
                ? "You haven't participated in any matches yet."
                : `No ${filter} matches found.`
              }
            </p>
            <Link
              to="/tournaments"
              className="inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#273470' }}
            >
              <FaTrophy className="mr-2" size={14} />
              Browse Tournaments
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match, index) => {
              const matchStatusInfo = getMatchStatus(match);
              
              return (
                <div key={match._id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-slate-800">{match.team1}</div>
                        <div className="text-xs text-slate-500">vs</div>
                        <div className="font-semibold text-slate-800">{match.team2}</div>
                      </div>
                      
                      <div className="border-l border-slate-200 pl-4">
                        <div className="text-sm font-medium text-slate-800">
                          {match.tournament?.name || 'Tournament'}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <FaCalendarAlt size={12} />
                          {formatDate(match.startDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${matchStatusInfo.bg} ${matchStatusInfo.color}`}>
                        <FaClock className="inline mr-1" size={10} />
                        {matchStatusInfo.status.charAt(0).toUpperCase() + matchStatusInfo.status.slice(1)}
                      </span>
                      
                      <Link
                        to={`/matches/${match._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm"
                      >
                        <FaEye size={14} />
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">{match.userTeamsCount}</div>
                      <div className="text-xs text-slate-600">Teams Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: '#273470' }}>{match.contestsParticipated}</div>
                      <div className="text-xs text-slate-600">Contests Joined</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {match.teams?.reduce((sum, team) => sum + (team.totalPoints || 0), 0) || 0}
                      </div>
                      <div className="text-xs text-slate-600">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-600">
                        {match.result ? 'Result Available' : '-'}
                      </div>
                      <div className="text-xs text-slate-600">Match Result</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more ad after every 3 matches */}
        {Math.floor(filteredMatches.length / 3) > 0 && (
          <div className="mt-8">
            <HorizontalBannerMedium />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMatches;