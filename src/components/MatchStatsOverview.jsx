import { useState } from 'react';
import { FiTrendingUp, FiShield, FiStar, FiTarget, FiActivity, FiBarChart2, FiUsers, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import useMatchStats from '../hooks/useMatchStats';

const MatchStatsOverview = ({ matchId }) => {
  const { 
    matchSummary, 
    fantasyBreakdown, 
    playerStats, 
    teamStats, 
    scorecard,
    loading, 
    error 
  } = useMatchStats(matchId);

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    batting: false,
    bowling: false,
    fielding: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">Match statistics not available</p>
          <p className="text-sm text-gray-500 mt-1">Statistics will be available after match completion</p>
        </div>
      </div>
    );
  }

  if (!matchSummary) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <FiBarChart2 className="mx-auto text-gray-400 mb-2" size={48} />
          <p className="text-gray-600">No match statistics available</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart2 },
    { id: 'scorecard', label: 'Scorecard', icon: FiTarget },
    { id: 'players', label: 'Top Players', icon: FiUsers },
    { id: 'fantasy', label: 'Fantasy Breakdown', icon: FiAward },
    { id: 'teams', label: 'Team Stats', icon: FiShield }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Match Statistics</h2>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <FiActivity size={16} />
            <span>Live Stats</span>
          </div>
        </div>

        {/* Match Result */}
        {matchSummary.summary?.result && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <div className="text-white">
              <p className="font-semibold text-lg">{matchSummary.summary.result}</p>
              {matchSummary.summary.winnerTeam && (
                <p className="text-white/80 mt-1">Winner: {matchSummary.summary.winnerTeam}</p>
              )}
              <p className="text-white/60 text-sm mt-1">Status: {matchSummary.summary.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#273470] text-[#273470] bg-[#273470]/5'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matchSummary.highlights?.topPerformers?.highestScore && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTarget className="text-yellow-600" />
                    <h3 className="font-semibold text-gray-800">Highest Score</h3>
                  </div>
                  <p className="text-lg font-bold text-yellow-800">
                    {matchSummary.highlights.topPerformers.highestScore.playerName}
                  </p>
                  <p className="text-yellow-700">
                    {matchSummary.highlights.topPerformers.highestScore.runs} runs
                    ({matchSummary.highlights.topPerformers.highestScore.balls} balls)
                  </p>
                  <p className="text-sm text-yellow-600">
                    SR: {matchSummary.highlights.topPerformers.highestScore.strikeRate}
                  </p>
                </div>
              )}

              {matchSummary.highlights?.topPerformers?.mostWickets && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiActivity className="text-red-600" />
                    <h3 className="font-semibold text-gray-800">Best Bowler</h3>
                  </div>
                  <p className="text-lg font-bold text-red-800">
                    {matchSummary.highlights.topPerformers.mostWickets.playerName}
                  </p>
                  <p className="text-red-700">
                    {matchSummary.highlights.topPerformers.mostWickets.wickets} wickets
                  </p>
                  <p className="text-sm text-red-600">
                    Eco: {matchSummary.highlights.topPerformers.mostWickets.economy}
                  </p>
                </div>
              )}

              {matchSummary.highlights?.topPerformers?.mostFantasyPoints && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAward className="text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Fantasy MVP</h3>
                  </div>
                  <p className="text-lg font-bold text-purple-800">
                    {matchSummary.highlights.topPerformers.mostFantasyPoints.playerName}
                  </p>
                  <p className="text-purple-700">
                    {matchSummary.highlights.topPerformers.mostFantasyPoints.points} points
                  </p>
                  <p className="text-sm text-purple-600">Fantasy Leader</p>
                </div>
              )}
            </div>

            {/* Total Fantasy Points */}
            <div className="bg-gradient-to-r from-[#273470]/10 to-[#273470]/5 border border-[#273470]/20 rounded-lg p-6">
              <div className="text-center">
                <FiTrendingUp className="mx-auto text-[#273470] mb-2" size={32} />
                <h3 className="text-2xl font-bold text-[#273470] mb-1">
                  {matchSummary?.totalFantasyPoints || 0}
                </h3>
                <p className="text-gray-600">Total Fantasy Points Generated</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scorecard' && scorecard && (
          <div className="space-y-6">
            {/* Match Info */}
            <div className="bg-gradient-to-r from-[#273470]/5 to-[#1e2859]/5 border border-[#273470]/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{scorecard.matchInfo?.matchName}</h3>
                  <p className="text-sm text-gray-600">Match Key: {scorecard.matchInfo?.matchKey}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Status: {scorecard.matchInfo?.status}</p>
                  <p className="text-xs text-gray-500">
                    {scorecard.matchInfo?.startTime && new Date(scorecard.matchInfo.startTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Totals Summary */}
            {scorecard.teamTotals && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scorecard.teamTotals?.map((team, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{team.teamName}</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-[#273470]">
                        {team.totalRuns}/{team.totalWickets}
                      </span>
                      <span className="text-gray-600">
                        ({team.totalOvers} overs)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Innings */}
            {scorecard.innings?.map((innings, inningsIndex) => (
              <div key={inningsIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Innings {innings.inningsNumber}: {innings.battingTeam}
                    </h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#273470]">
                        {innings.totalScore}/{innings.totalWickets}
                      </span>
                      <span className="text-gray-600 ml-2">({innings.totalOvers} overs)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-6">
                  {/* Batting */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FiTarget className="text-yellow-600" />
                      Batting
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-700">Batsman</th>
                            <th className="text-right py-2 font-medium text-gray-700">Runs</th>
                            <th className="text-right py-2 font-medium text-gray-700">Balls</th>
                            <th className="text-right py-2 font-medium text-gray-700">4s</th>
                            <th className="text-right py-2 font-medium text-gray-700">6s</th>
                            <th className="text-right py-2 font-medium text-gray-700">SR</th>
                            <th className="text-left py-2 font-medium text-gray-700">Dismissal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {innings.batting?.map((player, playerIndex) => (
                            <tr key={playerIndex} className="border-b border-gray-100">
                              <td className="py-2 font-medium text-gray-800">{player.playerName}</td>
                              <td className="py-2 text-right font-semibold">{player.runs}</td>
                              <td className="py-2 text-right text-gray-600">{player.balls}</td>
                              <td className="py-2 text-right text-gray-600">{player.fours}</td>
                              <td className="py-2 text-right text-gray-600">{player.sixes}</td>
                              <td className="py-2 text-right text-gray-600">{player.strikeRate}</td>
                              <td className="py-2 text-gray-600 text-sm">{player.dismissal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bowling */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FiActivity className="text-red-600" />
                      Bowling
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-700">Bowler</th>
                            <th className="text-right py-2 font-medium text-gray-700">Overs</th>
                            <th className="text-right py-2 font-medium text-gray-700">Maidens</th>
                            <th className="text-right py-2 font-medium text-gray-700">Runs</th>
                            <th className="text-right py-2 font-medium text-gray-700">Wickets</th>
                            <th className="text-right py-2 font-medium text-gray-700">Economy</th>
                            <th className="text-right py-2 font-medium text-gray-700">Wides</th>
                            <th className="text-right py-2 font-medium text-gray-700">No Balls</th>
                          </tr>
                        </thead>
                        <tbody>
                          {innings.bowling?.map((player, playerIndex) => (
                            <tr key={playerIndex} className="border-b border-gray-100">
                              <td className="py-2 font-medium text-gray-800">{player.playerName}</td>
                              <td className="py-2 text-right">{player.overs}</td>
                              <td className="py-2 text-right text-gray-600">{player.maidens}</td>
                              <td className="py-2 text-right">{player.runs}</td>
                              <td className="py-2 text-right font-semibold">{player.wickets}</td>
                              <td className="py-2 text-right text-gray-600">{player.economy}</td>
                              <td className="py-2 text-right text-gray-500">{player.wides}</td>
                              <td className="py-2 text-right text-gray-500">{player.noBalls}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!scorecard.innings?.length && (
              <div className="text-center py-8">
                <FiTarget className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-600">Scorecard not available</p>
                <p className="text-sm text-gray-500 mt-1">Scorecard will be available during or after the match</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'players' && playerStats && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Fantasy Performers</h3>
            <div className="space-y-3">
              {(playerStats || []).slice(0, 10).map((player, index) => (
                <div
                  key={player.playerId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-[#273470]/10 text-[#273470]'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{player.playerName}</p>
                      <p className="text-sm text-gray-600">{player.team}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#273470]">
                      {player.combinedStats?.fantasy?.totalPoints || 0} pts
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>B: {player.combinedStats?.fantasy?.battingPoints || 0}</span>
                      <span>Bo: {player.combinedStats?.fantasy?.bowlingPoints || 0}</span>
                      <span>F: {player.combinedStats?.fantasy?.fieldingPoints || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fantasy' && fantasyBreakdown && (
          <div className="space-y-6">
            {/* Batting Points */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('batting')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FiTarget className="text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Batting Points</h3>
                    <p className="text-sm text-gray-600">
                      Total: {fantasyBreakdown.pointsBreakdown?.batting || 0} points
                    </p>
                  </div>
                </div>
                {expandedSections.batting ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.batting && (
                <div className="border-t border-gray-200 p-4">
                  <div className="space-y-3">
                    {fantasyBreakdown.playerBreakdowns?.filter(p => p.battingPoints > 0).slice(0, 5).map((player, index) => (
                      <div key={player.playerId} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{player.playerName}</p>
                          <p className="text-xs text-gray-600">
                            {player.breakdown?.batting?.runs || 0} runs, {player.breakdown?.batting?.fours || 0} fours, {player.breakdown?.batting?.sixes || 0} sixes
                          </p>
                        </div>
                        <span className="font-bold text-yellow-600">{player.battingPoints} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bowling Points */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('bowling')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FiActivity className="text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Bowling Points</h3>
                    <p className="text-sm text-gray-600">
                      Total: {fantasyBreakdown.pointsBreakdown?.bowling || 0} points
                    </p>
                  </div>
                </div>
                {expandedSections.bowling ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.bowling && (
                <div className="border-t border-gray-200 p-4">
                  <div className="space-y-3">
                    {fantasyBreakdown.playerBreakdowns?.filter(p => p.bowlingPoints > 0).slice(0, 5).map((player, index) => (
                      <div key={player.playerId} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{player.playerName}</p>
                          <p className="text-xs text-gray-600">
                            {player.breakdown?.bowling?.wickets || 0} wickets, {player.breakdown?.bowling?.overs || 0} overs
                          </p>
                        </div>
                        <span className="font-bold text-red-600">{player.bowlingPoints} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fielding Points */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('fielding')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FiShield className="text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Fielding Points</h3>
                    <p className="text-sm text-gray-600">
                      Total: {fantasyBreakdown.pointsBreakdown?.fielding || 0} points
                    </p>
                  </div>
                </div>
                {expandedSections.fielding ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.fielding && (
                <div className="border-t border-gray-200 p-4">
                  <div className="space-y-3">
                    {fantasyBreakdown.playerBreakdowns?.filter(p => p.fieldingPoints > 0).slice(0, 5).map((player, index) => (
                      <div key={player.playerId} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{player.playerName}</p>
                          <p className="text-xs text-gray-600">
                            {player.breakdown?.fielding?.catches || 0} catches, {player.breakdown?.fielding?.runOuts || 0} run-outs
                          </p>
                        </div>
                        <span className="font-bold text-green-600">{player.fieldingPoints} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'teams' && teamStats && (
          <div className="space-y-6">
            {teamStats?.map((team, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{team.teamName}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Scorers */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Top Scorers</h4>
                    <div className="space-y-2">
                      {team.topScorers?.map((player, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{player.playerName}</span>
                          <span className="text-sm text-gray-600">
                            {player.runs} ({player.balls})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Bowlers */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Top Bowlers</h4>
                    <div className="space-y-2">
                      {team.topWicketTakers?.map((player, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{player.playerName}</span>
                          <span className="text-sm text-gray-600">
                            {player.wickets}/{player.runs} ({player.overs})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchStatsOverview;