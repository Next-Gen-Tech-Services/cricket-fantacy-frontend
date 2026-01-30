import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiShare2, FiStar, FiUserPlus, FiSettings, FiCopy, FiAward, FiCalendar } from 'react-icons/fi';
import { leaguesAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const LeagueDetails = () => {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [league, setLeague] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    loadLeagueDetails();
  }, [leagueId]);

  const loadLeagueDetails = async () => {
    try {
      setLoading(true);
      const [leagueResponse, leaderboardResponse] = await Promise.all([
        leaguesAPI.getById(leagueId),
        leaguesAPI.getLeaderboard(leagueId)
      ]);

      if (leagueResponse.success) {
        setLeague(leagueResponse.data.league);
      }

      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.data.leaderboard || []);
      }
    } catch (error) {
      console.error('Load league details error:', error);
      toast.error('Failed to load league details');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      const response = await leaguesAPI.generateShareLink(leagueId);
      
      if (response.success) {
        setShareLink(response.data.shareLink);
        setShowShareModal(true);
      }
    } catch (error) {
      console.error('Generate share link error:', error);
      toast.error('Failed to generate share link');
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link', error);
    }
  };

  const getFillPercentage = () => {
    if (!league) return 0;
    return Math.round((league.currentMembers / league.maxMembers) * 100);
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return { icon: "🥇", color: "text-yellow-600" };
    if (rank === 2) return { icon: "🥈", color: "text-gray-500" };
    if (rank === 3) return { icon: "🥉", color: "text-orange-600" };
    return { icon: rank, color: "text-gray-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAward className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">League not found</h2>
          <button
            onClick={() => navigate('/tournaments')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header section */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
          >
            <FiArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          
          {/* League Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiAward size={28} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{league.name}</h1>
                    <div className="flex items-center space-x-3 text-blue-100">
                      <span className="text-sm">Created by {league.createdBy?.name}</span>
                      <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                      <span className="text-sm font-medium">{league.type.toUpperCase()} League</span>
                    </div>
                  </div>
                </div>
                {league.description && (
                  <p className="text-blue-100 mt-3 text-lg">{league.description}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleGenerateShareLink}
                  className="px-6 py-3 bg-white bg-opacity-15 hover:bg-opacity-25 rounded-xl flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                >
                  <FiShare2 size={18} />
                  <span className="font-medium">Share</span>
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{league.currentMembers}</div>
                <div className="text-blue-100 text-sm">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{league.maxMembers}</div>
                <div className="text-blue-100 text-sm">Max Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {league.rules?.entryFee > 0 ? `₹${league.rules.entryFee}` : 'Free'}
                </div>
                <div className="text-blue-100 text-sm">Entry Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{getFillPercentage()}%</div>
                <div className="text-blue-100 text-sm">Filled</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getFillPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm mb-8 border border-gray-100">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'leaderboard'
                ? 'bg-blue-600 text-white shadow-md transform scale-[0.98]'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiAward size={18} />
              <span>Leaderboard</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === 'members'
                ? 'bg-blue-600 text-white shadow-md transform scale-[0.98]'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FiUsers size={18} />
              <span>Members</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            {leaderboard && leaderboard.length > 0 ? (
              <>
                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8 text-white shadow-lg">
                    <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                      <span className="text-3xl">🏆</span>
                      <span>Top Performers</span>
                    </h3>
                    <div className="flex justify-center items-end gap-8">
                      {/* 2nd Place */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                          🥈
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{leaderboard[1]?.user?.name}</h4>
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
                        <h4 className="font-bold text-lg mb-1">{leaderboard[0]?.user?.name}</h4>
                        <p className="text-yellow-400 text-sm mb-2 font-semibold">{leaderboard[0]?.totalPoints || 0} pts</p>
                        <div className="bg-yellow-400 text-blue-600 px-4 py-2 rounded-full">
                          <span className="text-sm font-bold">👑 LEADER</span>
                        </div>
                      </div>
                      
                      {/* 3rd Place */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
                          🥉
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{leaderboard[2]?.user?.name}</h4>
                        <p className="text-white/80 text-xs mb-2">{leaderboard[2]?.totalPoints || 0} pts</p>
                        <div className="bg-white/20 px-3 py-1 rounded-full">
                          <span className="text-xs font-bold">#3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Leaderboard */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FiAward className="text-blue-600" size={20} />
                      <span>Full Rankings</span>
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {leaderboard.map((entry, index) => {
                      const rankDisplay = getRankDisplay(entry.rank || index + 1);
                      return (
                        <div
                          key={entry.user?._id || index}
                          className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                            index < 3 ? 'bg-gradient-to-r from-blue-50 to-transparent' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              index < 3 ? 'bg-white shadow-md' : 'bg-gray-100'
                            } ${rankDisplay.color}`}>
                              {rankDisplay.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                                <span>{entry.user?.name}</span>
                                {entry.leagueMemberData?.role === 'OWNER' && (
                                  <FiStar size={14} className="text-yellow-500" />
                                )}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {entry.totalMatches || 0} matches played
                                {entry.averagePoints && ` • Avg: ${entry.averagePoints} pts`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              {entry.totalPoints?.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm text-gray-500">points</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiAward className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Rankings Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  League rankings will appear as members participate in tournament matches.
                  Start playing to see your position on the leaderboard!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-blue-600" size={20} />
                <span>League Members</span>
                <span className="text-sm font-normal text-gray-500">({league.currentMembers})</span>
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {league.members?.filter(m => m.isActive).map((member) => (
                <div key={member.user._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {member.user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                        <span>{member.user.name}</span>
                        {member.role === 'OWNER' && (
                          <FiStar size={14} className="text-yellow-500" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === 'OWNER' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : member.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              )) || []}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiShare2 className="text-blue-600" size={24} />
              <span>Share League</span>
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Share this link with friends to invite them to your league. Anyone with this link can join!
            </p>
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={copyShareLink}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors duration-200 shadow-sm"
              >
                <FiCopy size={16} />
                <span>Copy</span>
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueDetails;