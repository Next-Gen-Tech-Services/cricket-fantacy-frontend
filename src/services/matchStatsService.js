import apiClient from './api';

class MatchStatsService {
  /**
   * Get match statistics by match ID
   * GET /api/match-stats/:matchId
   */
  static async getMatchStats(matchId) {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match stats:', error);
      throw error;
    }
  }

  /**
   * Get match statistics by match key
   * GET /api/match-stats/key/:matchKey
   */
  static async getMatchStatsByKey(matchKey) {
    try {
      const response = await apiClient.get(`/match-stats/key/${matchKey}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match stats by key:', error);
      throw error;
    }
  }

  /**
   * Get player statistics for a specific match
   * GET /api/match-stats/:matchId/players
   */
  static async getMatchPlayerStats(matchId, sortBy = 'totalPoints', order = 'desc') {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}/players`, {
        params: { sortBy, order }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }

  /**
   * Get team statistics for a specific match
   * GET /api/match-stats/:matchId/teams
   */
  static async getMatchTeamStats(matchId) {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}/teams`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  }

  /**
   * Get detailed player performance breakdown
   * GET /api/match-stats/:matchId/players/:playerId
   */
  static async getPlayerPerformance(matchId, playerId) {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player performance:', error);
      throw error;
    }
  }

  /**
   * Get match summary with key highlights
   * GET /api/match-stats/:matchId/summary
   */
  static async getMatchSummary(matchId) {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match summary:', error);
      throw error;
    }
  }

  /**
   * Get detailed match scorecard
   * GET /api/match-stats/:matchId/scorecard
   */
  static async getMatchScorecard(matchId) {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}/scorecard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match scorecard:', error);
      throw error;
    }
  }

  /**
   * Get fantasy points breakdown by category
   * GET /api/match-stats/:matchId/fantasy-breakdown
   */
  static async getFantasyBreakdown(matchId) {
    try {
      const response = await apiClient.get(`/match-stats/${matchId}/fantasy-breakdown`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fantasy breakdown:', error);
      throw error;
    }
  }

  /**
   * Get recent match statistics
   * GET /api/match-stats/recent
   */
  static async getRecentMatchStats(limit = 10) {
    try {
      const response = await apiClient.get('/match-stats/recent', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent match stats:', error);
      throw error;
    }
  }
}

export default MatchStatsService;