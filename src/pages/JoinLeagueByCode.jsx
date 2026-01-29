import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowLeft, FiCheck, FiX, FiAward, FiStar, FiLock } from 'react-icons/fi';
import { leaguesAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';

const JoinLeagueByCode = () => {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaguePreview();
  }, [shareCode]);

  const loadLeaguePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leaguesAPI.getLeaguePreview(shareCode);

      if (response.success) {
        setLeague(response.data.league);
      } else {
        throw new Error(response.message || 'League not found');
      }
    } catch (error) {
      console.error('Load league preview error:', error);
      setError(error.message || 'Failed to load league details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async () => {
    try {
      setJoining(true);
      const response = await leaguesAPI.joinByShareCode(shareCode);

      if (response.success) {
        toast.success('Successfully joined the league!');
        navigate(`/leagues/${response.data.league._id}`);
      } else {
        throw new Error(response.message || 'Failed to join league');
      }
    } catch (error) {
      console.error('Join league error:', error);
      toast.error(error.message || 'Failed to join league');
    } finally {
      setJoining(false);
    }
  };

  const getFillPercentage = () => {
    if (!league) return 0;
    return Math.round((league.currentMembers / league.maxMembers) * 100);
  };

  const isLeagueFull = () => {
    if (!league) return false;
    return league.currentMembers >= league.maxMembers;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="mt-6 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">League Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/tournaments')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Join League</h1>
        </div>

        {/* League Preview Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
                <FiAward size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{league.name}</h2>
                <div className="flex items-center space-x-2 text-blue-100">
                  <FiLock size={14} />
                  <span className="text-sm">Private League</span>
                </div>
              </div>
            </div>
            {league.description && (
              <p className="text-blue-100 mt-2">{league.description}</p>
            )}
          </div>

          {/* League Details */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {league.currentMembers}
                </div>
                <div className="text-sm text-gray-600">Current Members</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {league.maxMembers}
                </div>
                <div className="text-sm text-gray-600">Max Members</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>League Progress</span>
                <span>{getFillPercentage()}% filled</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isLeagueFull() ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${getFillPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* League Information */}
            <div className="space-y-4 mb-6">
              {league.primaryTournament && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tournament</span>
                  <span className="font-medium text-gray-900">
                    {league.primaryTournament.name}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Entry Fee</span>
                <span className="font-medium text-gray-900">
                  {league.rules?.entryFee > 0 ? `₹${league.rules.entryFee}` : 'Free'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Teams per User</span>
                <span className="font-medium text-gray-900">
                  {league.rules?.maxTeamsPerUser || 1}
                </span>
              </div>

              {league.createdBy && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">League Creator</span>
                  <div className="flex items-center space-x-2">
                    <FiStar size={14} className="text-yellow-500" />
                    <span className="font-medium text-gray-900">
                      {league.createdBy.name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Join Button */}
            <div className="space-y-3">
              {league.isUserMember ? (
                <div className={`w-full px-4 py-3 rounded-md text-center flex items-center justify-center space-x-2 ${
                  league.userRole === 'OWNER' ? 'bg-purple-50 border border-purple-200 text-purple-700' :
                  league.userRole === 'ADMIN' ? 'bg-orange-50 border border-orange-200 text-orange-700' :
                  'bg-green-50 border border-green-200 text-green-700'
                }`}>
                  <FiCheck size={20} />
                  <span className="font-medium">
                    {league.userRole === 'OWNER' ? 'You are the Owner' :
                     league.userRole === 'ADMIN' ? 'You are an Admin' :
                     'Already Joined'}
                  </span>
                </div>
              ) : isLeagueFull() ? (
                <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center">
                  League is full - No more spots available
                </div>
              ) : !isAuthenticated ? (
                <div className="w-full bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md text-center">
                  Please login to join this league
                </div>
              ) : (
                <button
                  onClick={handleJoinLeague}
                  disabled={joining}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {joining ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <FiCheck size={20} />
                      <span className="font-medium">Join This League</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => navigate('/tournaments')}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Browse Other Tournaments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinLeagueByCode;