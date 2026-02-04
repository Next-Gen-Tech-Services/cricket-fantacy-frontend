import api from './api';

/**
 * Fantasy Credits Service
 * Handles fetching and managing match-wise player credits
 */
class FantasyCreditsService {
  /**
   * Get fantasy match credits for a specific match
   * @param {string} matchKey - Match key
   * @returns {Promise<Object>} Match credits data
   */
  async getMatchCredits(matchKey) {
    try {
      const response = await api.get(`/fantasy/match-credits/${matchKey}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match credits:', error);
      throw error;
    }
  }

  /**
   * Get player credit for a specific match
   * @param {string} matchKey - Match key
   * @param {string} playerKey - Player key
   * @returns {Promise<number>} Player credit value
   */
  async getPlayerCredit(matchKey, playerKey) {
    try {
      const response = await api.get(`/fantasy/player-credit/${matchKey}/${playerKey}`);
      return response.data.data.credit;
    } catch (error) {
      console.error('Error fetching player credit:', error);
      return 8.5; // Default credit on error
    }
  }

  /**
   * Get enriched players with match-specific credits
   * @param {Array} players - Array of player objects
   * @param {string} matchKey - Match key
   * @returns {Promise<Array>} Players with updated credits
   */
  async enrichPlayersWithCredits(players, matchKey) {
    try {
      const response = await api.post('/fantasy/enrich-players', {
        players,
        matchKey
      });
      return response.data.data;
    } catch (error) {
      console.error('Error enriching players with credits:', error);
      return players; // Return original players on error
    }
  }

  /**
   * Validate fantasy team budget with match-specific credits
   * @param {Array} selectedPlayers - Array of selected player keys
   * @param {string} matchKey - Match key
   * @param {number} budget - Available budget (default 100)
   * @returns {Promise<Object>} Validation result
   */
  async validateTeamBudget(selectedPlayers, matchKey, budget = 100) {
    try {
      const response = await api.post('/fantasy/validate-budget', {
        selectedPlayers,
        matchKey,
        budget
      });
      return response.data.data;
    } catch (error) {
      console.error('Error validating team budget:', error);
      throw error;
    }
  }

  /**
   * Clear match credits cache
   * @param {string} matchKey - Match key
   * @returns {Promise<boolean>} Success status
   */
  async clearMatchCache(matchKey) {
    try {
      await api.delete(`/fantasy/cache/${matchKey}`);
      return true;
    } catch (error) {
      console.error('Error clearing match cache:', error);
      return false;
    }
  }

  /**
   * Get player credits map from credits data
   * @param {Object} creditsData - Credits data from API
   * @returns {Map} Map of player_key to credit value
   */
  getPlayerCreditsMap(creditsData) {
    const creditsMap = new Map();
    
    if (creditsData && creditsData.credits) {
      creditsData.credits.forEach(playerCredit => {
        creditsMap.set(playerCredit.player_key, {
          value: playerCredit.value || 8.5,
          intelligentRank: playerCredit.intelligent_rank,
          intelligentScore: playerCredit.intelligent_score,
          tournamentPoints: playerCredit.tournament_points
        });
      });
    }
    
    return creditsMap;
  }

  /**
   * Get sorted players by intelligent rank
   * @param {Object} creditsData - Credits data from API
   * @returns {Array} Sorted array of player credits
   */
  getSortedPlayersByRank(creditsData) {
    if (!creditsData || !creditsData.credits) {
      return [];
    }
    
    return [...creditsData.credits].sort((a, b) => 
      (a.intelligent_rank || 999) - (b.intelligent_rank || 999)
    );
  }

  /**
   * Filter players by credit range
   * @param {Object} creditsData - Credits data from API
   * @param {number} minCredit - Minimum credit
   * @param {number} maxCredit - Maximum credit
   * @returns {Array} Filtered array of player credits
   */
  filterPlayersByCredit(creditsData, minCredit, maxCredit) {
    if (!creditsData || !creditsData.credits) {
      return [];
    }
    
    return creditsData.credits.filter(player => 
      player.value >= minCredit && player.value <= maxCredit
    );
  }
}

// Export singleton instance
export default new FantasyCreditsService();
