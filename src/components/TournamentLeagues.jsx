import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShare2, FiEye, FiUserPlus, FiStar, FiLock, FiGlobe, FiAward } from 'react-icons/fi';
import { leaguesAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const TournamentLeagues = ({ tournament }) => {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningLeague, setJoiningLeague] = useState(null);

  useEffect(() => {
    loadTournamentLeagues();
  }, [tournament?._id]);

  const loadTournamentLeagues = async () => {
    try {
      setLoading(true);
      const response = await leaguesAPI.getTournamentLeagues(tournament._id, {
        includePrivate: true,
        limit: 20
      });

      if (response.success) {
        setLeagues(response.data.leagues);
      }
    } catch (error) {
      console.error('Load leagues error:', error);
      toast.error('Failed to load leagues');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async (league) => {
    try {
      setJoiningLeague(league._id);
      const response = await leaguesAPI.join(league._id);

      if (response.success) {
        toast.success('Successfully joined league!');
        loadTournamentLeagues(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to join league');
      }
    } catch (error) {
      console.error('Join league error:', error);
      toast.error(error.message || 'Failed to join league');
    } finally {
      setJoiningLeague(null);
    }
  };

  const handleViewLeague = (league) => {
    navigate(`/leagues/${league._id}`);
  };

  const handleShareLeague = async (league, e) => {
    e.stopPropagation();
    
    try {
      const response = await leaguesAPI.generateShareLink(league._id);
      
      if (response.success && response.data.shareLink) {
        await navigator.clipboard.writeText(response.data.shareLink);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share league error:', error);
      toast.error('Failed to generate share link');
    }
  };

  const getLeagueTypeIcon = (type) => {
    switch (type) {
      case 'PRIVATE':
        return <FiLock size={16} className="text-gray-500" />;
      case 'PUBLIC':
        return <FiGlobe size={16} className="text-green-500" />;
      default:
        return <FiUsers size={16} className="text-blue-500" />;
    }
  };

  const getFillPercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex items-center space-x-6">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAward className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No leagues yet</h3>
        <p className="text-gray-600">
          Be the first to create a league for this tournament!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {leagues.map((league) => (
        <div
          key={league._id}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-200"
          onClick={() => handleViewLeague(league)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* League Name and Type */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  {getLeagueTypeIcon(league.type)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{league.name}</h3>
                  {league.createdBy && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <FiStar size={12} className="text-yellow-500" />
                      <span>{league.createdBy.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {league.description && (
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {league.description}
                </p>
              )}

              {/* League Stats */}
              <div className="flex items-center space-x-6 text-sm mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiUsers size={16} className="text-blue-600" />
                  <span className="font-medium">
                    {league.currentMembers}/{league.maxMembers} members
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  {league.settings?.isPublic ? (
                    <><FiGlobe size={16} className="text-green-600" /><span className="font-medium text-green-600">Public</span></>
                  ) : (
                    <><FiLock size={16} className="text-orange-600" /><span className="font-medium text-orange-600">Private</span></>
                  )}
                </div>

                {league.rules?.entryFee > 0 && (
                  <div className="text-green-600 font-semibold">
                    ₹{league.rules.entryFee}
                  </div>
                )}

                {league.rules?.entryFee === 0 && (
                  <div className="text-blue-600 font-semibold">
                    Free
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>League filled</span>
                  <span className="font-medium">{getFillPercentage(league.currentMembers, league.maxMembers)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                    style={{
                      width: `${getFillPercentage(league.currentMembers, league.maxMembers)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 ml-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinLeague(league);
                }}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={
                  joiningLeague === league._id || 
                  league.currentMembers >= league.maxMembers
                }
              >
                {joiningLeague === league._id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <FiUserPlus size={16} />
                    <span>Join</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => handleShareLeague(league, e)}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <FiShare2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentLeagues;