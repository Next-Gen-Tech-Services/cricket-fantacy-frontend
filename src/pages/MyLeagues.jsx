import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaTrophy, FaCrown, FaPlus } from 'react-icons/fa';
import { useGetUserLeaguesQuery } from '../api/userApi';
import LoadingSpinner from '../components/LoadingSpinner';

const MyLeagues = () => {
    const [filter, setFilter] = useState('all'); // all, admin, member
    const { data: userLeagues, isLoading, error } = useGetUserLeaguesQuery();

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="min-h-screen bg-main flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Leagues</h2>
                    <p className="text-gray-600">{error.message || 'Failed to load your leagues'}</p>
                </div>
            </div>
        );
    }

    const leagues = userLeagues?.data?.leagues || [];

    const getFilteredLeagues = () => {
        if (filter === 'all') return leagues;
        return leagues.filter(league => {
            if (filter === 'admin') return league.userStats.isAdmin;
            if (filter === 'member') return !league.userStats.isAdmin;
            return true;
        });
    };

    const filteredLeagues = getFilteredLeagues();
    const getRankBadge = (rank) => {
        if (rank === 1) return { icon: '🥇', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        if (rank === 2) return { icon: '🥈', color: 'text-gray-600', bg: 'bg-gray-100' };
        if (rank === 3) return { icon: '🥉', color: 'text-orange-600', bg: 'bg-orange-100' };
        return { icon: `#${rank}`, color: 'text-slate-600', bg: 'bg-slate-100' };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Leagues</h1>
                            <p className="text-gray-600">Manage and track your fantasy cricket leagues</p>
                        </div>
                       
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                    {[
                        { key: 'all', label: `All Leagues (${leagues.length})` },
                        { key: 'admin', label: 'Admin' },
                        { key: 'member', label: 'Member' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${filter === tab.key
                                    ? 'text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            style={filter === tab.key ? { backgroundColor: '#273470' } : {}}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Leagues Grid */}
                {filteredLeagues.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                        <div className="text-gray-400 mb-4">
                            <FaUsers size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leagues found</h3>
                        <p className="text-gray-600 mb-4">
                            {filter === 'all'
                                ? "You haven't joined any leagues yet."
                                : `No ${filter} leagues found.`
                            }
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/leagues"
                                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <FaUsers className="mr-2" size={14} />
                                Browse Leagues
                            </Link>
                            <Link
                                to="/leagues/create"
                                className="inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                                style={{ backgroundColor: '#273470' }}
                            >
                                <FaPlus className="mr-2" size={14} />
                                Create League
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLeagues.map((league, index) => {
                            const rankBadge = getRankBadge(league.userStats.rank);

                            return (
                                <div key={league._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* League Header */}
                                    <div className="p-6 text-white" style={{ background: `linear-gradient(to right, #273470, #1e2a5f)` }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                                                    {league.type || 'Private'}
                                                </span>
                                                {league.userStats.isAdmin && (
                                                    <span className="px-2 py-1 bg-yellow-500/90 text-yellow-900 rounded-full text-xs font-medium flex items-center gap-1">
                                                        <FaCrown size={10} />
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${rankBadge.bg} ${rankBadge.color}`}>
                                                {rankBadge.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-1">{league.name}</h3>
                                        <p className="text-white/80 text-sm">
                                            by {league.createdBy?.name || 'Unknown'}
                                        </p>
                                    </div>

                                    {/* League Stats */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900">{league.members.length}</div>
                                                <div className="text-xs text-gray-500">Members</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold" style={{ color: '#273470' }}>{league.tournamentContests?.length || 0}</div>
                                                <div className="text-xs text-gray-500">Matches</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600">{league.userStats.totalPoints}</div>
                                                <div className="text-xs text-gray-500">Your Points</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-purple-600">{league.userStats.teamsCreated}</div>
                                                <div className="text-xs text-gray-500">Teams Created</div>
                                            </div>
                                        </div>


                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/leagues/${league._id}`}
                                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium text-center hover:bg-gray-200 transition-colors"
                                            >
                                                View Details
                                            </Link>

                                            {league.tournamentContests && league.tournamentContests.length > 0 && (
                                                <Link
                                                    to={`/tournaments/${league.primaryTournament}/leaderboard?league=${league._id}`}
                                                    className="flex items-center gap-1 px-3 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                                                    style={{ backgroundColor: '#273470' }}
                                                >
                                                    <FaTrophy size={12} />
                                                    Leaderboard
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLeagues;