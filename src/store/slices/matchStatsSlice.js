import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MatchStatsService from '../../services/matchStatsService';

// Async thunks for match stats
export const fetchMatchStats = createAsyncThunk(
  'matchStats/fetchMatchStats',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await MatchStatsService.getMatchStats(matchId);
      return { matchId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMatchSummary = createAsyncThunk(
  'matchStats/fetchMatchSummary',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await MatchStatsService.getMatchSummary(matchId);
      return { matchId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPlayerStats = createAsyncThunk(
  'matchStats/fetchPlayerStats',
  async ({ matchId, sortBy = 'totalPoints', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await MatchStatsService.getMatchPlayerStats(matchId, sortBy, order);
      return { matchId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFantasyBreakdown = createAsyncThunk(
  'matchStats/fetchFantasyBreakdown',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await MatchStatsService.getFantasyBreakdown(matchId);
      return { matchId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTeamStats = createAsyncThunk(
  'matchStats/fetchTeamStats',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await MatchStatsService.getMatchTeamStats(matchId);
      return { matchId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPlayerPerformance = createAsyncThunk(
  'matchStats/fetchPlayerPerformance',
  async ({ matchId, playerId }, { rejectWithValue }) => {
    try {
      const response = await MatchStatsService.getPlayerPerformance(matchId, playerId);
      return { matchId, playerId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  // Match statistics by match ID
  matchStats: {},
  
  // Match summaries by match ID
  matchSummaries: {},
  
  // Player statistics by match ID
  playerStats: {},
  
  // Fantasy breakdowns by match ID
  fantasyBreakdowns: {},
  
  // Team statistics by match ID
  teamStats: {},
  
  // Individual player performances by match ID and player ID
  playerPerformances: {},
  
  // Recent match statistics
  recentStats: [],
  
  // Loading states
  loading: {
    matchStats: false,
    summary: false,
    players: false,
    fantasy: false,
    teams: false,
    playerPerformance: false,
    recent: false
  },
  
  // Error states
  errors: {
    matchStats: null,
    summary: null,
    players: null,
    fantasy: null,
    teams: null,
    playerPerformance: null,
    recent: null
  },
  
  // Last updated timestamps
  lastUpdated: {}
};

const matchStatsSlice = createSlice({
  name: 'matchStats',
  initialState,
  reducers: {
    clearMatchStats: (state, action) => {
      const matchId = action.payload;
      if (matchId) {
        // Clear specific match data
        delete state.matchStats[matchId];
        delete state.matchSummaries[matchId];
        delete state.playerStats[matchId];
        delete state.fantasyBreakdowns[matchId];
        delete state.teamStats[matchId];
        delete state.lastUpdated[matchId];
        
        // Clear player performances for this match
        Object.keys(state.playerPerformances).forEach(key => {
          if (key.startsWith(`${matchId}-`)) {
            delete state.playerPerformances[key];
          }
        });
        
        // Clear any errors for this match
        Object.keys(state.errors).forEach(errorKey => {
          state.errors[errorKey] = null;
        });
      } else {
        // Clear all data
        return initialState;
      }
    },
    
    clearErrors: (state) => {
      state.errors = {
        matchStats: null,
        summary: null,
        players: null,
        fantasy: null,
        teams: null,
        playerPerformance: null,
        recent: null
      };
    },
    
    setLastUpdated: (state, action) => {
      const { matchId } = action.payload;
      state.lastUpdated[matchId] = Date.now();
    }
  },
  
  extraReducers: (builder) => {
    // Fetch Match Stats
    builder
      .addCase(fetchMatchStats.pending, (state) => {
        state.loading.matchStats = true;
        state.errors.matchStats = null;
      })
      .addCase(fetchMatchStats.fulfilled, (state, action) => {
        const { matchId, data } = action.payload;
        state.loading.matchStats = false;
        state.matchStats[matchId] = data;
        state.lastUpdated[matchId] = Date.now();
      })
      .addCase(fetchMatchStats.rejected, (state, action) => {
        state.loading.matchStats = false;
        state.errors.matchStats = action.payload;
      });

    // Fetch Match Summary
    builder
      .addCase(fetchMatchSummary.pending, (state) => {
        state.loading.summary = true;
        state.errors.summary = null;
      })
      .addCase(fetchMatchSummary.fulfilled, (state, action) => {
        const { matchId, data } = action.payload;
        state.loading.summary = false;
        state.matchSummaries[matchId] = data;
        state.lastUpdated[matchId] = Date.now();
      })
      .addCase(fetchMatchSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.errors.summary = action.payload;
      });

    // Fetch Player Stats
    builder
      .addCase(fetchPlayerStats.pending, (state) => {
        state.loading.players = true;
        state.errors.players = null;
      })
      .addCase(fetchPlayerStats.fulfilled, (state, action) => {
        const { matchId, data } = action.payload;
        state.loading.players = false;
        state.playerStats[matchId] = data;
        state.lastUpdated[matchId] = Date.now();
      })
      .addCase(fetchPlayerStats.rejected, (state, action) => {
        state.loading.players = false;
        state.errors.players = action.payload;
      });

    // Fetch Fantasy Breakdown
    builder
      .addCase(fetchFantasyBreakdown.pending, (state) => {
        state.loading.fantasy = true;
        state.errors.fantasy = null;
      })
      .addCase(fetchFantasyBreakdown.fulfilled, (state, action) => {
        const { matchId, data } = action.payload;
        state.loading.fantasy = false;
        state.fantasyBreakdowns[matchId] = data;
        state.lastUpdated[matchId] = Date.now();
      })
      .addCase(fetchFantasyBreakdown.rejected, (state, action) => {
        state.loading.fantasy = false;
        state.errors.fantasy = action.payload;
      });

    // Fetch Team Stats
    builder
      .addCase(fetchTeamStats.pending, (state) => {
        state.loading.teams = true;
        state.errors.teams = null;
      })
      .addCase(fetchTeamStats.fulfilled, (state, action) => {
        const { matchId, data } = action.payload;
        state.loading.teams = false;
        state.teamStats[matchId] = data;
        state.lastUpdated[matchId] = Date.now();
      })
      .addCase(fetchTeamStats.rejected, (state, action) => {
        state.loading.teams = false;
        state.errors.teams = action.payload;
      });

    // Fetch Player Performance
    builder
      .addCase(fetchPlayerPerformance.pending, (state) => {
        state.loading.playerPerformance = true;
        state.errors.playerPerformance = null;
      })
      .addCase(fetchPlayerPerformance.fulfilled, (state, action) => {
        const { matchId, playerId, data } = action.payload;
        state.loading.playerPerformance = false;
        state.playerPerformances[`${matchId}-${playerId}`] = data;
      })
      .addCase(fetchPlayerPerformance.rejected, (state, action) => {
        state.loading.playerPerformance = false;
        state.errors.playerPerformance = action.payload;
      });
  }
});

export const { clearMatchStats, clearErrors, setLastUpdated } = matchStatsSlice.actions;

// Selectors
export const selectMatchStats = (state, matchId) => 
  state.matchStats.matchStats[matchId];

export const selectMatchSummary = (state, matchId) => 
  state.matchStats.matchSummaries[matchId];

export const selectPlayerStats = (state, matchId) => 
  state.matchStats.playerStats[matchId];

export const selectFantasyBreakdown = (state, matchId) => 
  state.matchStats.fantasyBreakdowns[matchId];

export const selectTeamStats = (state, matchId) => 
  state.matchStats.teamStats[matchId];

export const selectPlayerPerformance = (state, matchId, playerId) => 
  state.matchStats.playerPerformances[`${matchId}-${playerId}`];

export const selectMatchStatsLoading = (state) => 
  state.matchStats.loading;

export const selectMatchStatsErrors = (state) => 
  state.matchStats.errors;

export const selectLastUpdated = (state, matchId) => 
  state.matchStats.lastUpdated[matchId];

export default matchStatsSlice.reducer;