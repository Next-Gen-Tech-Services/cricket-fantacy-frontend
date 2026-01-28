import { API_BASE_URL } from '../store/api';

// Roanuz API configuration
const ROANUZ_BASE_URL = 'https://api.sports.roanuz.com/v5/cricket';
const ROANUZ_TOKEN = 'v5sRS_P_1953059256576118792s2016300188137834485';
const PROJECT_KEY = 'RS_P_1953059256576118792';

// Live match data service
export class LiveMatchService {
  constructor() {
    this.intervals = new Map(); // Store intervals for different matches
    this.matchData = new Map(); // Cache match data
  }

  /**
   * Fetch live match data from Roanuz API
   */
  async fetchLiveMatchData(matchKey) {
    try {
      const response = await fetch(
        `${ROANUZ_BASE_URL}/${PROJECT_KEY}/match/${matchKey}/?token=${ROANUZ_TOKEN}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch live data: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the match data
      this.matchData.set(matchKey, {
        ...data,
        lastUpdated: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error fetching live match data:', error);
      throw error;
    }
  }

  /**
   * Calculate fantasy points based on player performance
   */
  calculateFantasyPoints(playerData, playerRole) {
    let points = 0;
    
    // Handle the new Roanuz API structure where player data contains score object
    const playerStats = playerData.score?.[1] || playerData.score || playerData;

    // Batting points
    if (playerStats.batting) {
      const battingScore = playerStats.batting.score;
      if (battingScore) {
        const { runs, balls, fours, sixes, strike_rate } = battingScore;
        
        // Runs: 1 point per run
        points += runs || 0;
        
        // Boundaries: 1 point per 4, 2 points per 6
        points += (fours || 0) * 1;
        points += (sixes || 0) * 2;
        
        // Strike rate bonuses
        if (balls >= 10) {
          if (strike_rate >= 170) points += 6;
          else if (strike_rate >= 150) points += 4;
          else if (strike_rate >= 130) points += 2;
          else if (strike_rate < 60) points -= 6;
          else if (strike_rate < 70) points -= 4;
          else if (strike_rate < 80) points -= 2;
        }

        // Milestone bonuses
        if (runs >= 100) points += 16;
        else if (runs >= 50) points += 8;
        else if (runs >= 30) points += 4;
      }
    }

    // Bowling points
    if (playerStats.bowling) {
      const bowlingScore = playerStats.bowling.score;
      if (bowlingScore) {
        const { wickets, economy, runs: runs_conceded } = bowlingScore;
        const totalBalls = bowlingScore.balls || 0;
        const overs = totalBalls / 6;
        
        // Wickets: 25 points per wicket
        points += (wickets || 0) * 25;
        
        // Economy rate bonuses (minimum 2 overs)
        if (overs >= 2 && economy !== undefined) {
          if (economy <= 5) points += 6;
          else if (economy <= 6) points += 4;
          else if (economy <= 7) points += 2;
          else if (economy >= 12) points -= 6;
          else if (economy >= 11) points -= 4;
          else if (economy >= 10) points -= 2;
        }

        // Wicket milestone bonuses
        if (wickets >= 5) points += 16;
        else if (wickets >= 4) points += 8;
        else if (wickets >= 3) points += 4;
      }
    }

    // Fielding points
    if (playerStats.fielding) {
      const { catches, stumpings, runouts, runout_direct_hits } = playerStats.fielding;
      
      points += (catches || 0) * 8;
      points += (stumpings || 0) * 12;
      points += ((runouts || 0) + (runout_direct_hits || 0)) * 12;
    }

    // Captain and Vice-Captain multipliers will be applied later
    return Math.max(0, points); // Ensure points are not negative
  }

  /**
   * Update fantasy team scores based on live match data
   */
  async updateFantasyScores(matchId, liveMatchData) {
    try {
      // Get all fantasy teams for this match
      const response = await fetch(`${API_BASE_URL}/fantasy-teams/match/${matchId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fantasy teams');
      }

      const fantasyTeams = await response.json();

      // Calculate scores for each team
      const updatedTeams = fantasyTeams.map(team => {
        let totalScore = 0;
        const playerScores = {};

        team.players.forEach(player => {
          // Find player stats in live data
          const playerData = this.findPlayerStatsInLiveData(player.playerId, liveMatchData);
          
          if (playerData) {
            let playerScore = this.calculateFantasyPoints(playerData, player.role);
            
            // Apply captain/vice-captain multipliers
            if (team.captain && team.captain.playerId === player.playerId) {
              playerScore *= 2; // Captain gets 2x points
            } else if (team.viceCaptain && team.viceCaptain.playerId === player.playerId) {
              playerScore *= 1.5; // Vice-captain gets 1.5x points
            }

            playerScores[player.playerId] = playerScore;
            totalScore += playerScore;
          }
        });

        return {
          ...team,
          currentScore: Math.round(totalScore),
          playerScores,
          lastScoreUpdate: Date.now()
        };
      });

      // Send updated scores to backend
      await this.updateScoresInBackend(matchId, updatedTeams);

      return updatedTeams;
    } catch (error) {
      console.error('Error updating fantasy scores:', error);
      throw error;
    }
  }

  /**
   * Find player statistics in live match data
   */
  findPlayerStatsInLiveData(playerId, liveMatchData) {
    // Handle the new Roanuz API structure
    const matchData = liveMatchData.data || liveMatchData.response || liveMatchData;
    
    if (!matchData.players) return null;

    // The players object contains player data keyed by player keys
    const playerData = matchData.players[playerId];
    
    if (playerData) {
      return playerData;
    }

    // If not found by key, search through all players
    for (const [playerKey, playerInfo] of Object.entries(matchData.players)) {
      const player = playerInfo.player;
      if (player && (player.key === playerId || player.name === playerId)) {
        return playerInfo;
      }
    }

    return null;
  }

  /**
   * Send updated scores to backend
   */
  async updateScoresInBackend(matchId, updatedTeams) {
    try {
      const response = await fetch(`${API_BASE_URL}/fantasy-teams/update-scores`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          teams: updatedTeams.map(team => ({
            teamId: team._id,
            totalScore: team.currentScore,
            playerScores: team.playerScores,
            lastUpdate: team.lastScoreUpdate
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update scores in backend');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating scores in backend:', error);
      throw error;
    }
  }

  /**
   * Start live tracking for a match
   */
  async startLiveTracking(matchId, matchKey, startTime = null) {
    // Check if match has started
    const now = Date.now();
    const matchStartTime = startTime ? new Date(startTime).getTime() : now;

    if (now < matchStartTime) {
      // Schedule to start tracking when match begins
      const delay = matchStartTime - now;
      setTimeout(() => {
        this.startLiveTracking(matchId, matchKey);
      }, delay);
      
      console.log(`Live tracking scheduled for match ${matchId} in ${Math.round(delay / 60000)} minutes`);
      return;
    }

    // Clear any existing interval for this match
    this.stopLiveTracking(matchId);

    console.log(`Starting live tracking for match ${matchId}`);

    // Initial fetch
    try {
      const liveData = await this.fetchLiveMatchData(matchKey);
      await this.updateFantasyScores(matchId, liveData);
      console.log(`Initial score update completed for match ${matchId}`);
    } catch (error) {
      console.error(`Error in initial score update for match ${matchId}:`, error);
    }

    // Set up 30-minute interval
    const intervalId = setInterval(async () => {
      try {
        console.log(`Fetching live data for match ${matchId}...`);
        const liveData = await this.fetchLiveMatchData(matchKey);
        
        // Check if match is still in progress
        if (this.isMatchCompleted(liveData)) {
          console.log(`Match ${matchId} completed. Stopping live tracking.`);
          this.stopLiveTracking(matchId);
          
          // Do final score update
          await this.updateFantasyScores(matchId, liveData);
          return;
        }

        await this.updateFantasyScores(matchId, liveData);
        console.log(`Score update completed for match ${matchId}`);
      } catch (error) {
        console.error(`Error updating scores for match ${matchId}:`, error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    this.intervals.set(matchId, intervalId);
  }

  /**
   * Stop live tracking for a match
   */
  stopLiveTracking(matchId) {
    const intervalId = this.intervals.get(matchId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(matchId);
      console.log(`Stopped live tracking for match ${matchId}`);
    }
  }

  /**
   * Check if match is completed
   */
  isMatchCompleted(liveMatchData) {
    // Handle the new Roanuz API structure
    const matchData = liveMatchData.data || liveMatchData.response || liveMatchData;
    const status = matchData.status;
    const playStatus = matchData.play_status;
    
    // Check both status fields for completion indicators
    const completedStatuses = ['completed', 'finished', 'result'];
    
    return completedStatuses.some(s => 
      status?.toLowerCase().includes(s.toLowerCase()) ||
      playStatus?.toLowerCase().includes(s.toLowerCase())
    );
  }

  /**
   * Get cached match data
   */
  getCachedMatchData(matchKey) {
    return this.matchData.get(matchKey);
  }

  /**
   * Test method to process sample data and calculate scores
   */
  processTestData(sampleMatchData) {
    console.log('Processing test match data:', sampleMatchData.data?.name || 'Unknown Match');
    
    const matchData = sampleMatchData.data || sampleMatchData;
    
    // Log match status
    console.log('Match Status:', matchData.status, '| Play Status:', matchData.play_status);
    
    // Process player scores
    if (matchData.players) {
      const playerResults = [];
      
      for (const [playerKey, playerData] of Object.entries(matchData.players)) {
        const player = playerData.player;
        const score = this.calculateFantasyPoints(playerData, player?.seasonal_role || 'unknown');
        
        playerResults.push({
          name: player?.name || player?.jersey_name || 'Unknown',
          key: playerKey,
          role: player?.seasonal_role || 'unknown',
          fantasyPoints: score,
          stats: {
            batting: playerData.score?.[1]?.batting?.score || null,
            bowling: playerData.score?.[1]?.bowling?.score || null,
            fielding: playerData.score?.[1]?.fielding || null
          }
        });
      }
      
      // Sort by fantasy points
      playerResults.sort((a, b) => b.fantasyPoints - a.fantasyPoints);
      
      console.log('Top performing players:');
      playerResults.slice(0, 10).forEach((player, index) => {
        console.log(`${index + 1}. ${player.name} (${player.role}): ${player.fantasyPoints} points`);
      });
      
      return playerResults;
    }
    
    return [];
  }

  /**
   * Clear all intervals and cached data
   */
  cleanup() {
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervals.clear();
    this.matchData.clear();
  }
}

// Export singleton instance
export const liveMatchService = new LiveMatchService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    liveMatchService.cleanup();
  });
}