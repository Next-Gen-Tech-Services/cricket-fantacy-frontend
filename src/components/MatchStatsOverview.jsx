import { useState } from 'react';
import { FiTrendingUp, FiShield, FiTarget, FiActivity, FiBarChart2, FiUsers, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
                  <p className="text-sm text-gray-600">Status: {scorecard.matchInfo?.status}</p>
                </div>
                <div className="text-right text-sm text-gray-700">
                  <span className="font-medium">Teams:</span>
                  <span className="ml-2">
                    {scorecard.matchInfo?.teams?.a?.name} vs {scorecard.matchInfo?.teams?.b?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Innings */}
            {scorecard.innings?.map((innings, inningsIndex) => {
              const formatOvers = (arr) => Array.isArray(arr) && arr.length === 2 ? `${arr[0]}.${arr[1]}` : (innings.totalOvers || '');
              const isA = String(innings.index || '').startsWith('a');
              const battingTeam = isA ? (scorecard.matchInfo?.teams?.a?.name || 'Team A') : (scorecard.matchInfo?.teams?.b?.name || 'Team B');
              const totalRuns = innings.score?.runs ?? innings.totalScore ?? 0;
              const totalWickets = innings.wickets ?? innings.totalWickets ?? 0;
              const totalOvers = formatOvers(innings.overs);
              const scoreStr = innings.score_str || `${totalRuns}/${totalWickets}${totalOvers ? ` in ${totalOvers}` : ''}`;

              // Resolve player display name from scorecard.players when available
              const resolveName = (key) => {
                if (!key) return '';
                // Prefer DB-resolved names
                if (scorecard.resolvedNames && scorecard.resolvedNames[key] && scorecard.resolvedNames[key].name) {
                  return scorecard.resolvedNames[key].name;
                }
                const direct = scorecard.players && scorecard.players[key];
                if (direct && direct.name) return direct.name;
                // Fallback: search by matching player.key or id inside players map
                const playersArr = scorecard.players ? Object.values(scorecard.players) : [];
                const found = playersArr.find(p => p?.key === key || p?.id === key || p?.playerKey === key);
                // As a last resort, make a readable label from the key
                const fallback = (str) => String(str)
                  .replace(/^(c|b|lbw|stumped|run_out|hit_wicket|retired_hurt|obstructing_the_field|handled_the_ball|time_out|caught_and_bowled|caught|bowled)__/i, '')
                  .replace(/^(c__player__|b__player__|player__)/i, '')
                  .replace(/__[a-z0-9]{3,8}$/i, '')
                  .replace(/_/g, ' ');
                return found?.name || fallback(key);
              };

              // Derive batting stats from partnerships (runs/balls/fours/sixes)
              const battingAgg = new Map();
              (innings.partnerships || []).forEach(p => {
                if (p.player_a_key && p.player_a_score) {
                  const a = battingAgg.get(p.player_a_key) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
                  a.runs += p.player_a_score.runs || 0;
                  a.balls += p.player_a_score.balls || 0;
                  a.fours += p.player_a_score.fours || 0;
                  a.sixes += p.player_a_score.sixes || 0;
                  battingAgg.set(p.player_a_key, a);
                }
                if (p.player_b_key && p.player_b_score) {
                  const b = battingAgg.get(p.player_b_key) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
                  b.runs += p.player_b_score.runs || 0;
                  b.balls += p.player_b_score.balls || 0;
                  b.fours += p.player_b_score.fours || 0;
                  b.sixes += p.player_b_score.sixes || 0;
                  battingAgg.set(p.player_b_key, b);
                }
              });

              const battingRows = (Array.isArray(innings.batting_order) ? innings.batting_order : [])
                .map(key => ({ key, name: resolveName(key), ...(battingAgg.get(key) || { runs: 0, balls: 0, fours: 0, sixes: 0 }) }))
                .filter(row => row.name);

              // Did Not Bat: players in batting_order but with zero aggregate (no partnership contribution)
              const didNotBat = (Array.isArray(innings.batting_order) ? innings.batting_order : [])
                .filter(key => !battingAgg.has(key))
                .map(key => resolveName(key))
                .filter(Boolean);

              // Extract bowling entries when present
              const toArray = (objOrArr) => Array.isArray(objOrArr) ? objOrArr : (objOrArr && typeof objOrArr === 'object' ? Object.values(objOrArr) : []);
              const rawBowling = innings.bowling || innings.bowler_stats || innings.bowlers;
              const bowlingRows = toArray(rawBowling).map((b, i) => {
                const key = b.player_key || b.playerKey || b.key || b.id || b.player || (Array.isArray(innings.bowling_order) ? innings.bowling_order[i] : undefined);
                const name = b.player_name || b.playerName || resolveName(key);
                return {
                  key: key || name,
                  name,
                  overs: b.overs ?? b.o ?? b.bowled_overs ?? '-',
                  maidens: b.maidens ?? b.m ?? '-',
                  runs: b.runs ?? b.r ?? '-',
                  wickets: b.wickets ?? b.w ?? '-',
                  economy: b.economy ?? b.eco ?? (b.overs && b.runs ? (Number(b.runs) / Number(b.overs)).toFixed(2) : '-'),
                  wides: b.wides ?? b.wd ?? 0,
                  noBalls: b.no_balls ?? b.nb ?? 0
                };
              }).filter(row => row.name);

              return (
                <div key={inningsIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Innings {inningsIndex + 1}: {battingTeam}
                      </h3>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#273470]">{totalRuns}/{totalWickets}</span>
                        {totalOvers && <span className="text-gray-600 ml-2">({totalOvers} overs)</span>}
                      </div>
                    </div>
                    {scoreStr && (
                      <p className="text-sm text-gray-600 mt-1">{scoreStr}</p>
                    )}
                  </div>

                  <div className="p-4 space-y-6">
                    {/* Batting (derived from partnerships when batting table missing) */}
                    {battingRows.length > 0 && (
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
                              </tr>
                            </thead>
                            <tbody>
                              {battingRows.map((row, i) => (
                                <tr key={row.key} className="border-b border-gray-100">
                                  <td className="py-2 font-medium text-gray-800">{row.name}</td>
                                  <td className="py-2 text-right font-semibold">{row.runs}</td>
                                  <td className="py-2 text-right text-gray-600">{row.balls}</td>
                                  <td className="py-2 text-right text-gray-600">{row.fours}</td>
                                  <td className="py-2 text-right text-gray-600">{row.sixes}</td>
                                  <td className="py-2 text-right text-gray-600">{row.balls ? ((row.runs / row.balls) * 100).toFixed(1) : '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Note: Batting stats derived from partnerships data.</p>
                      </div>
                    )}

                    {/* Score Summary */}
                    {innings.score && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-gray-600">Runs / Balls</h4>
                          <p className="text-sm font-bold text-gray-800">{innings.score.runs} / {innings.score.balls}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-gray-600">Fours / Sixes</h4>
                          <p className="text-sm font-bold text-gray-800">{innings.score.fours} / {innings.score.sixes}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-gray-600">Dot Balls</h4>
                          <p className="text-sm font-bold text-gray-800">{innings.score.dot_balls}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <h4 className="text-xs font-medium text-gray-600">Run Rate</h4>
                          <p className="text-sm font-bold text-gray-800">{innings.score.run_rate}</p>
                        </div>
                      </div>
                    )}

                    {/* Bowling */}
                    {bowlingRows.length > 0 && (
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
                                <th className="text-right py-2 font-medium text-gray-700">O</th>
                                <th className="text-right py-2 font-medium text-gray-700">M</th>
                                <th className="text-right py-2 font-medium text-gray-700">R</th>
                                <th className="text-right py-2 font-medium text-gray-700">W</th>
                                <th className="text-right py-2 font-medium text-gray-700">Eco</th>
                                <th className="text-right py-2 font-medium text-gray-700">Wd</th>
                                <th className="text-right py-2 font-medium text-gray-700">Nb</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bowlingRows.map((row) => (
                                <tr key={row.key} className="border-b border-gray-100">
                                  <td className="py-2 font-medium text-gray-800">{row.name}</td>
                                  <td className="py-2 text-right">{row.overs}</td>
                                  <td className="py-2 text-right text-gray-600">{row.maidens}</td>
                                  <td className="py-2 text-right">{row.runs}</td>
                                  <td className="py-2 text-right font-semibold">{row.wickets}</td>
                                  <td className="py-2 text-right text-gray-600">{row.economy}</td>
                                  <td className="py-2 text-right text-gray-500">{row.wides}</td>
                                  <td className="py-2 text-right text-gray-500">{row.noBalls}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Extras */}
                    {innings.extra_runs && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2"><FiTarget className="text-yellow-600" />Extras</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['extra','bye','leg_bye','wide','no_ball','penalty'].map(key => (
                            <div key={key} className="bg-white border border-gray-200 rounded-lg p-3">
                              <h5 className="text-xs font-medium text-gray-600 uppercase">{key.replace('_',' ')}</h5>
                              <p className="text-sm font-bold text-gray-800">{innings.extra_runs?.[key] ?? 0}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Balls Breakdown */}
                    {innings.balls_breakup && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2"><FiActivity className="text-red-600" />Balls</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['balls','dot_balls','wides','no_balls'].map(key => (
                            <div key={key} className="bg-white border border-gray-200 rounded-lg p-3">
                              <h5 className="text-xs font-medium text-gray-600 uppercase">{key.replace('_',' ')}</h5>
                              <p className="text-sm font-bold text-gray-800">{innings.balls_breakup?.[key] ?? 0}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fall of Wickets */}
                    {Array.isArray(innings.wicket_order) && innings.wicket_order.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Fall of Wickets</h4>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                          {innings.wicket_order.map((w, idx) => (
                            <span key={w + idx} className="bg-gray-100 px-2 py-1 rounded">
                              {idx + 1}. {resolveName(w)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Partnerships */}
                    {Array.isArray(innings.partnerships) && innings.partnerships.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Partnerships</h4>
                        <div className="space-y-2">
                          {innings.partnerships.map((p, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">{resolveName(p.player_a_key)}</span>
                                <span className="text-gray-500"> + </span>
                                <span className="font-medium">{resolveName(p.player_b_key)}</span>
                                <span className="text-gray-500 ml-2">({p.begin_overs?.join('.')}-{p.end_overs?.join('.')})</span>
                              </div>
                              <div className="text-sm text-gray-700">
                                <span className="font-bold text-[#273470]">{p.score?.runs} runs</span>
                                <span className="ml-2 text-gray-600">{p.score?.balls} balls</span>
                                {p.score?.run_rate && (<span className="ml-2 text-gray-600">RR {p.score.run_rate}</span>)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Did Not Bat */}
                    {didNotBat.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Did Not Bat</h4>
                        <p className="text-sm text-gray-700">{didNotBat.join(', ')}</p>
                      </div>
                    )}

                    {/* Note when player tables are unavailable */}
                    {!innings.batting && !innings.bowling && (
                      <p className="text-xs text-gray-500">Detailed batting/bowling tables not provided in this scorecard. Showing available summary.</p>
                    )}
                  </div>
                </div>
              );
            })}

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
              {(() => {
                // Build lookups from fantasy breakdown to enrich per-category points
                const breakdownList = fantasyBreakdown?.playerBreakdowns || [];
                const breakdownById = new Map(breakdownList.map(p => [p.playerId, p]));
                const normalize = (s) => String(s || '')
                  .toLowerCase()
                  .replaceAll('_', ' ')
                  .replaceAll('.', ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                const breakdownByName = new Map(breakdownList.map(p => [normalize(p.playerName), p]));
                // If API playerStats are empty or zeroed, fallback to breakdown list for display
                const meaningful = Array.isArray(playerStats) && playerStats.some(p => {
                  const n = p.playerName || p.name || p.fullName;
                  const pts = p.combinedStats?.fantasy?.totalPoints ?? 0;
                  return n && pts > 0;
                });
                // Secondary fallback: summary topPlayers
                const summaryTop = matchSummary?.topPlayers || [];

                let sourceList = [];
                if (meaningful) {
                  sourceList = playerStats || [];
                } else if (Array.isArray(summaryTop) && summaryTop.length > 0) {
                  sourceList = summaryTop.map(p => ({
                    playerId: p._id || p.playerId,
                    playerName: p.name || p.playerName,
                    team: p.team,
                    combinedStats: { fantasy: { totalPoints: p.fantasyPoints || p.totalPoints || 0 } }
                  }));
                } else if (breakdownList.length > 0) {
                  sourceList = breakdownList.map(p => ({
                  playerId: p.playerId,
                  playerName: p.playerName,
                  team: p.teamName || p.team || '',
                  combinedStats: { fantasy: { totalPoints: p.totalPoints } },
                  }));
                } else if (scorecard?.players && typeof scorecard.players === 'object') {
                  // Last fallback: names from scorecard players map
                  sourceList = Object.values(scorecard.players).map(p => ({
                    playerId: p.key || p.id,
                    playerName: p.name,
                    team: p.team?.name || p.team,
                    combinedStats: { fantasy: { totalPoints: 0 } }
                  }));
                }
                return (sourceList || []).slice(0, 10).map((player, index) => {
                  // Prefer DB-resolved name from scorecard map when available
                  const resolved = scorecard?.resolvedNames?.[player.playerId]?.name;
                  const name = resolved || player.playerName || player.name || player.fullName || 'Unknown Player';
                  const teamLabel = typeof player.team === 'string'
                    ? player.team
                    : (player.team?.name || player.team?.code || player.teamName || '');
                  // Match breakdown by id first; fallback to normalized name
                  let bd = breakdownById.get(player.playerId) || null;
                  if (!bd && name && name !== 'Unknown Player') {
                    bd = breakdownByName.get(normalize(name)) || null;
                  }
                  const battingPts = bd?.battingPoints ?? player.combinedStats?.fantasy?.battingPoints ?? 0;
                  const bowlingPts = bd?.bowlingPoints ?? player.combinedStats?.fantasy?.bowlingPoints ?? 0;
                  const fieldingPts = bd?.fieldingPoints ?? player.combinedStats?.fantasy?.fieldingPoints ?? 0;
                  const totalPts = player.combinedStats?.fantasy?.totalPoints ?? bd?.totalPoints ?? player.fantasyPoints ?? 0;

                  return (
                    <div
                      key={player.playerId || name + index}
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
                          <p className="font-semibold text-gray-800">{name}</p>
                          {teamLabel && (
                            <p className="text-sm text-gray-600">{teamLabel}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#273470]">{totalPts} pts</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>B: {battingPts}</span>
                          <span>Bo: {bowlingPts}</span>
                          <span>F: {fieldingPts}</span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
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