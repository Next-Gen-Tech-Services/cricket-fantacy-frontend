import React, { useState } from 'react';
import { FiX, FiBarChart2, FiTrendingUp, FiTarget, FiActivity, FiShield, FiAward } from 'react-icons/fi';
import useMatchStats from '../hooks/useMatchStats';

const PlayerStatsModal = ({ 
  isOpen, 
  onClose, 
  matchId, 
  playerId, 
  playerName 
}) => {
  const { fetchPlayerPerformance } = useMatchStats(matchId);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch player performance when modal opens
  const loadPlayerData = async () => {
    if (!playerId || !matchId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlayerPerformance(playerId);
      setPlayerData(data);
    } catch (err) {
      console.error('Error fetching player data:', err);
      setError('Failed to load player statistics');
    } finally {
      setLoading(false);
    }
  };

  // Load data when modal opens
  React.useEffect(() => {
    if (isOpen && playerId) {
      loadPlayerData();
    }
  }, [isOpen, playerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiBarChart2 className="text-[#273470]" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{playerName || 'Player Statistics'}</h2>
                <p className="text-sm text-gray-600">Detailed Performance Breakdown</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto mb-4 w-8 h-8 border-2 border-[#273470] border-t-transparent rounded-full"></div>
              <p className="text-gray-600">Loading player statistics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadPlayerData}
                className="px-4 py-2 bg-[#273470] text-white rounded-lg hover:bg-[#1e2859] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !playerData ? (
            <div className="text-center py-12">
              <FiBarChart2 className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No statistics available for this player</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                  <FiAward className="mx-auto text-purple-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-purple-800">
                    {playerData.overallStats?.totalFantasyPoints || 0}
                  </p>
                  <p className="text-sm text-purple-600">Fantasy Points</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                  <FiTarget className="mx-auto text-yellow-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-yellow-800">
                    {playerData.overallStats?.totalRuns || 0}
                  </p>
                  <p className="text-sm text-yellow-600">Total Runs</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 text-center">
                  <FiActivity className="mx-auto text-red-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-red-800">
                    {playerData.overallStats?.totalWickets || 0}
                  </p>
                  <p className="text-sm text-red-600">Total Wickets</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                  <FiShield className="mx-auto text-green-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-green-800">
                    {playerData.overallStats?.totalFieldingPoints || 0}
                  </p>
                  <p className="text-sm text-green-600">Fielding Actions</p>
                </div>
              </div>

              {/* Innings Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Innings Breakdown</h3>
                <div className="space-y-4">
                  {playerData.inningsBreakdown?.map((innings, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-700">
                          Innings {innings.innings}
                        </h4>
                        <div className="text-sm text-gray-600">
                          {innings.battingTeam} vs {innings.bowlingTeam}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Batting Performance */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-yellow-700 flex items-center gap-2">
                            <FiTarget size={16} />
                            Batting
                          </h5>
                          <div className="bg-yellow-50 rounded-lg p-3 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Runs:</span>
                              <span className="font-medium">{innings.performance.batting.runs || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Balls:</span>
                              <span className="font-medium">{innings.performance.batting.balls || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">4s/6s:</span>
                              <span className="font-medium">
                                {innings.performance.batting.fours || 0}/{innings.performance.batting.sixes || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">SR:</span>
                              <span className="font-medium">{innings.performance.batting.strikeRate || 0}</span>
                            </div>
                            <div className="flex justify-between text-yellow-700 border-t pt-1">
                              <span className="text-sm font-medium">Points:</span>
                              <span className="font-bold">{innings.performance.fantasyPoints.battingPoints || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bowling Performance */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-red-700 flex items-center gap-2">
                            <FiActivity size={16} />
                            Bowling
                          </h5>
                          <div className="bg-red-50 rounded-lg p-3 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Overs:</span>
                              <span className="font-medium">{innings.performance.bowling.overs || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Wickets:</span>
                              <span className="font-medium">{innings.performance.bowling.wickets || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Runs:</span>
                              <span className="font-medium">{innings.performance.bowling.runs || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Economy:</span>
                              <span className="font-medium">{innings.performance.bowling.economy || 0}</span>
                            </div>
                            <div className="flex justify-between text-red-700 border-t pt-1">
                              <span className="text-sm font-medium">Points:</span>
                              <span className="font-bold">{innings.performance.fantasyPoints.bowlingPoints || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Fielding Performance */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700 flex items-center gap-2">
                            <FiShield size={16} />
                            Fielding
                          </h5>
                          <div className="bg-green-50 rounded-lg p-3 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Catches:</span>
                              <span className="font-medium">{innings.performance.fielding.catches || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Stumpings:</span>
                              <span className="font-medium">{innings.performance.fielding.stumpings || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Run Outs:</span>
                              <span className="font-medium">{innings.performance.fielding.runOuts || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Direct:</span>
                              <span className="font-medium">{innings.performance.fielding.directRunOuts || 0}</span>
                            </div>
                            <div className="flex justify-between text-green-700 border-t pt-1">
                              <span className="text-sm font-medium">Points:</span>
                              <span className="font-bold">{innings.performance.fantasyPoints.fieldingPoints || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Fantasy Points for this innings */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Innings Total:</span>
                          <span className="text-xl font-bold text-[#273470]">
                            {innings.performance.fantasyPoints.totalPoints || 0} points
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsModal;