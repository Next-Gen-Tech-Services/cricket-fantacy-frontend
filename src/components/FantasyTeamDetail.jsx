import React from 'react';
import { FiUser, FiShield, FiStar, FiTrendingUp, FiUsers, FiAward, FiClock } from 'react-icons/fi';

const FantasyTeamDetail = ({ team, showActions = false, onEdit, onView }) => {
  if (!team) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-center">No team data available</p>
      </div>
    );
  }

  const getPlayersByRole = (role) => {
    return team.players?.filter(p => {
      const playerRole = p.player?.role;
      // Map API role names to our expected format
      const roleMapping = {
        'WK': 'WICKET_KEEPER',
        'BAT': 'BATSMAN', 
        'AR': 'ALL_ROUNDER',
        'BOWL': 'BOWLER'
      };
      return playerRole === roleMapping[role];
    }) || [];
  };

  const getCaptain = () => {
    // Use the processed captain field from API or find from players array
    return team.captain?.player || team.players?.find(p => p.role === 'CAPTAIN')?.player || null;
  };

  const getViceCaptain = () => {
    // Use the processed viceCaptain field from API or find from players array  
    return team.viceCaptain?.player || team.players?.find(p => p.role === 'VICE_CAPTAIN')?.player || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'submitted':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const captain = getCaptain();
  const viceCaptain = getViceCaptain();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">
              {team.teamName || 'Fantasy Team'}
            </h3>
            <p className="text-blue-100 text-sm">
              {formatDate(team.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(team.status)} text-white mb-2`}>
              {team.status?.toUpperCase() || 'DRAFT'}
            </div>
            {team.isValid !== undefined && (
              <div className={`block text-xs ${team.isValid ? 'text-green-200' : 'text-red-200'}`}>
                {team.isValid ? '✓ Valid Team' : '✗ Invalid Team'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <FiUsers className="mx-auto text-[#273470] mb-1" size={20} />
            <p className="text-sm text-gray-600">Players</p>
            <p className="text-lg font-bold text-gray-800">{team.players?.length || 0}/11</p>
          </div>
          
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <FiTrendingUp className="mx-auto text-green-500 mb-1" size={20} />
            <p className="text-sm text-gray-600">Points</p>
            <p className="text-lg font-bold text-gray-800">{team.totalFantasyPoints || 0}</p>
          </div>
          
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <FiAward className="mx-auto text-yellow-500 mb-1" size={20} />
            <p className="text-sm text-gray-600">Credits Used</p>
            <p className="text-lg font-bold text-gray-800">{team.totalCreditsUsed || 0}/100</p>
          </div>
          
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <FiClock className="mx-auto text-blue-500 mb-1" size={20} />
            <p className="text-sm text-gray-600">Contests</p>
            <p className="text-lg font-bold text-gray-800">{team.contests?.length || 0}</p>
          </div>
        </div>

        {/* Captain & Vice Captain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center mb-2">
              <FiShield className="text-yellow-600 mr-2" size={18} />
              <span className="text-yellow-800 font-semibold">Captain</span>
            </div>
            <p className="text-gray-800 font-bold">
              {captain?.name || 'Not selected'}
            </p>
            {captain && (
              <p className="text-gray-600 text-sm">{captain.role} • 2x points</p>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <FiStar className="text-gray-600 mr-2" size={18} />
              <span className="text-gray-800 font-semibold">Vice Captain</span>
            </div>
            <p className="text-gray-800 font-bold">
              {viceCaptain?.name || 'Not selected'}
            </p>
            {viceCaptain && (
              <p className="text-gray-600 text-sm">{viceCaptain.role} • 1.5x points</p>
            )}
          </div>
        </div>

        {/* Players by Role */}
        {team.players && team.players.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Team Composition</h4>
            
            {['WK', 'BAT', 'AR', 'BOWL'].map(role => {
              const roleLabel = {
                'WK': 'Wicket Keepers',
                'BAT': 'Batsmen', 
                'AR': 'All Rounders',
                'BOWL': 'Bowlers'
              };
              
              const rolePlayers = team.players.filter(p => {
                const playerRole = p.player?.role;
                const roleMapping = {
                  'WK': 'WICKET_KEEPER',
                  'BAT': 'BATSMAN',
                  'AR': 'ALL_ROUNDER', 
                  'BOWL': 'BOWLER'
                };
                return playerRole === roleMapping[role];
              });
              
              if (rolePlayers.length === 0) return null;
              
              return (
                <div key={role} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700">
                      {roleLabel[role]} ({rolePlayers.length})
                    </h5>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {rolePlayers.map((playerEntry, index) => {
                        const player = playerEntry.player;
                        const isCaptain = playerEntry.role === 'CAPTAIN';
                        const isViceCaptain = playerEntry.role === 'VICE_CAPTAIN';
                        
                        return (
                          <div
                            key={player?._id || index}
                            className={`p-3 rounded-lg border ${
                              isCaptain 
                                ? 'border-yellow-300 bg-yellow-50' 
                                : isViceCaptain 
                                ? 'border-gray-300 bg-gray-50' 
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {player?.name || 'Unknown Player'}
                                  {isCaptain && (
                                    <span className="ml-2 text-yellow-600">
                                      <FiShield className="inline" size={14} />
                                    </span>
                                  )}
                                  {isViceCaptain && (
                                    <span className="ml-2 text-gray-600">
                                      <FiStar className="inline" size={14} />
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-600">{player?.shortName || player?.team || 'Player'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-[#273470]">
                                  {playerEntry.credits || 0}
                                </p>
                                <p className="text-xs text-gray-500">pts</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={() => onEdit(team)}
                className="flex-1 bg-[#273470] hover:bg-[#1e2859] text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Edit Team
              </button>
            )}
            {onView && (
              <button
                onClick={() => onView(team)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                View Details
              </button>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {team.validationErrors && team.validationErrors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h5 className="text-sm font-semibold text-red-800 mb-2">Team Issues:</h5>
            <ul className="space-y-1">
              {team.validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FantasyTeamDetail;