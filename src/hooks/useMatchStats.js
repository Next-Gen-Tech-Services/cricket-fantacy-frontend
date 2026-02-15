import { useState, useEffect, useCallback } from 'react';
import MatchStatsService from '../services/matchStatsService';
import PlayerService from '../services/playerService';

const useMatchStats = (matchId, options = {}) => {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
    fetchOnMount = true
  } = options;

  const [matchStats, setMatchStats] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [matchSummary, setMatchSummary] = useState(null);
  const [fantasyBreakdown, setFantasyBreakdown] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all match statistics
  const fetchMatchStats = useCallback(async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching match stats for matchId:', matchId);

      const [
        statsResponse,
        playersResponse,
        teamsResponse,
        summaryResponse,
        breakdownResponse,
        scorecardResponse
      ] = await Promise.allSettled([
        MatchStatsService.getMatchStats(matchId),
        MatchStatsService.getMatchPlayerStats(matchId),
        MatchStatsService.getMatchTeamStats(matchId),
        MatchStatsService.getMatchSummary(matchId),
        MatchStatsService.getFantasyBreakdown(matchId),
        MatchStatsService.getMatchScorecard(matchId)
      ]);

      console.log('📊 API responses:', {
        stats: statsResponse.value,
        players: playersResponse.status,
        teams: teamsResponse.status,
        summary: summaryResponse.status,
        breakdown: breakdownResponse.status,
        scorecard: scorecardResponse.status
      });

      // Handle each response
      if (statsResponse.status === 'fulfilled') {
        setMatchStats(statsResponse.value.data);
        console.log('✅ Match stats loaded successfully');
      } else {
        console.error('❌ Match stats failed:', statsResponse.reason);
      }
      
      if (playersResponse.status === 'fulfilled') {
        setPlayerStats(playersResponse.value.data.players || []);
        console.log('✅ Player stats loaded:', playersResponse.value.data.players?.length || 0, 'players');
      } else {
        console.error('❌ Player stats failed:', playersResponse.reason);
      }
      
      if (teamsResponse.status === 'fulfilled') {
        const teamsData = teamsResponse.value.data.teams || {};
        // Convert teams object {a: {}, b: {}} to array format
        const teamsArray = Object.values(teamsData);
        setTeamStats(teamsArray);
        console.log('✅ Team stats loaded:', teamsArray.length, 'teams');
      } else {
        console.error('❌ Team stats failed:', teamsResponse.reason);
      }
      
      if (summaryResponse.status === 'fulfilled') {
        setMatchSummary(summaryResponse.value.data);
        console.log('✅ Match summary loaded, total points:', summaryResponse.value.data?.totalFantasyPoints);
      } else {
        console.error('❌ Match summary failed:', summaryResponse.reason);
      }
      
      if (breakdownResponse.status === 'fulfilled') {
        setFantasyBreakdown(breakdownResponse.value.data);
        console.log('✅ Matchplay breakdown loaded');
      } else {
        console.error('❌ Matchplay breakdown failed:', breakdownResponse.reason);
      }
      
      if (scorecardResponse.status === 'fulfilled') {
        const sc = scorecardResponse.value.data;
        // Attempt DB-based name resolution for keys found in scorecard
        try {
          const collectKeys = (inn) => {
            const keys = new Set();
            if (Array.isArray(inn.batting_order)) inn.batting_order.forEach(k => k && keys.add(k));
            if (Array.isArray(inn.bowling_order)) inn.bowling_order.forEach(k => k && keys.add(k));
            if (Array.isArray(inn.wicket_order)) inn.wicket_order.forEach(k => k && keys.add(k));
            if (Array.isArray(inn.partnerships)) {
              inn.partnerships.forEach(p => {
                if (p.player_a_key) keys.add(p.player_a_key);
                if (p.player_b_key) keys.add(p.player_b_key);
              });
            }
            const rawBowling = inn.bowling || inn.bowler_stats || inn.bowlers;
            const arr = Array.isArray(rawBowling) ? rawBowling : (rawBowling && typeof rawBowling === 'object' ? Object.values(rawBowling) : []);
            arr.forEach(b => {
              const k = b?.player_key || b?.playerKey || b?.key || b?.id || b?.player;
              if (k) keys.add(k);
            });
            return Array.from(keys);
          };

          const allKeys = Array.isArray(sc.innings) ? sc.innings.flatMap(collectKeys) : [];
          const uniqueKeys = Array.from(new Set(allKeys.filter(Boolean)));

          let resolvedNames = {};
          if (uniqueKeys.length > 0) {
            const resolvedResp = await PlayerService.resolveKeys(uniqueKeys);
            resolvedNames = resolvedResp?.data || {};
          }

          setScorecard({ ...sc, resolvedNames });
        } catch (nameErr) {
          console.warn('⚠️ Name resolution failed, using raw scorecard:', nameErr?.message || nameErr);
          setScorecard(sc);
        }
        console.log('✅ Scorecard loaded');
      } else {
        console.error('❌ Scorecard failed:', scorecardResponse.reason);
      }

      // If all requests failed, set error
      const allFailed = [statsResponse, playersResponse, teamsResponse, summaryResponse, breakdownResponse, scorecardResponse]
        .every(response => response.status === 'rejected');
      
      if (allFailed) {
        console.error('💥 All match stats requests failed');
        setError('Failed to load match statistics');
      } else {
        console.log('✅ Match stats loading completed');
      }

    } catch (err) {
      console.error('💥 Error fetching match stats:', err);
      setError(err.message || 'Failed to load match statistics');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Fetch specific player performance
  const fetchPlayerPerformance = async (playerId) => {
    try {
      const response = await MatchStatsService.getPlayerPerformance(matchId, playerId);
      return response.data;
    } catch (err) {
      console.error('Error fetching player performance:', err);
      throw err;
    }
  };

  // Refresh match statistics
  const refreshStats = () => {
    fetchMatchStats();
  };

  // Initial fetch
  useEffect(() => {
    if (fetchOnMount && matchId) {
      fetchMatchStats();
    }
  }, [fetchOnMount, fetchMatchStats]);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh || !matchId) return;

    const interval = setInterval(() => {
      fetchMatchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, matchId, refreshInterval]);

  return {
    // Data
    matchStats,
    playerStats,
    teamStats,
    matchSummary,
    fantasyBreakdown,
    scorecard,
    
    // State
    loading,
    error,
    
    // Actions
    fetchMatchStats,
    fetchPlayerPerformance,
    refreshStats
  };
};

export default useMatchStats;