import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action to initialize live tracking for a match
export const initializeLiveTracking = createAsyncThunk(
  'liveMatch/initializeLiveTracking',
  async ({ matchId, matchKey, startTime }, { rejectWithValue }) => {
    try {
      const { liveMatchService } = await import('../../services/liveMatchService');
      await liveMatchService.startLiveTracking(matchId, matchKey, startTime);
      
      return {
        matchId,
        matchKey,
        isTracking: true,
        lastUpdate: Date.now()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to stop live tracking for a match
export const stopLiveTracking = createAsyncThunk(
  'liveMatch/stopLiveTracking',
  async ({ matchId }, { rejectWithValue }) => {
    try {
      const { liveMatchService } = await import('../../services/liveMatchService');
      liveMatchService.stopLiveTracking(matchId);
      
      return { matchId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action to manually update scores
export const updateLiveScores = createAsyncThunk(
  'liveMatch/updateLiveScores',
  async ({ matchId, matchKey }, { rejectWithValue }) => {
    try {
      const { liveMatchService } = await import('../../services/liveMatchService');
      
      // Fetch latest live data
      const liveData = await liveMatchService.fetchLiveMatchData(matchKey);
      
      // Update fantasy scores
      const updatedTeams = await liveMatchService.updateFantasyScores(matchId, liveData);
      
      return {
        matchId,
        matchData: liveData,
        updatedTeams,
        lastUpdate: Date.now()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const liveMatchSlice = createSlice({
  name: 'liveMatch',
  initialState: {
    // Track live matches
    liveMatches: {}, // matchId -> { isTracking, matchKey, lastUpdate, matchData }
    
    // Store live match data
    matchData: {}, // matchId -> live match data
    
    // Store updated team scores
    teamScores: {}, // matchId -> { teams: [...], lastUpdate }
    
    // Loading and error states
    loading: {},
    error: {},
  },
  reducers: {
    // Clear error for a specific match
    clearMatchError: (state, action) => {
      const { matchId } = action.payload;
      delete state.error[matchId];
    },
    
    // Update team scores locally (for real-time UI updates)
    updateTeamScoresLocal: (state, action) => {
      const { matchId, teams } = action.payload;
      state.teamScores[matchId] = {
        teams,
        lastUpdate: Date.now()
      };
    },
    
    // Set match data
    setMatchData: (state, action) => {
      const { matchId, data } = action.payload;
      state.matchData[matchId] = {
        ...data,
        lastUpdated: Date.now()
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize live tracking
      .addCase(initializeLiveTracking.pending, (state, action) => {
        const { matchId } = action.meta.arg;
        state.loading[matchId] = true;
        delete state.error[matchId];
      })
      .addCase(initializeLiveTracking.fulfilled, (state, action) => {
        const { matchId, matchKey, isTracking, lastUpdate } = action.payload;
        state.loading[matchId] = false;
        state.liveMatches[matchId] = {
          isTracking,
          matchKey,
          lastUpdate
        };
      })
      .addCase(initializeLiveTracking.rejected, (state, action) => {
        const { matchId } = action.meta.arg;
        state.loading[matchId] = false;
        state.error[matchId] = action.payload;
      })
      
      // Stop live tracking
      .addCase(stopLiveTracking.pending, (state, action) => {
        const { matchId } = action.meta.arg;
        state.loading[matchId] = true;
      })
      .addCase(stopLiveTracking.fulfilled, (state, action) => {
        const { matchId } = action.payload;
        state.loading[matchId] = false;
        if (state.liveMatches[matchId]) {
          state.liveMatches[matchId].isTracking = false;
        }
      })
      .addCase(stopLiveTracking.rejected, (state, action) => {
        const { matchId } = action.meta.arg;
        state.loading[matchId] = false;
        state.error[matchId] = action.payload;
      })
      
      // Update live scores
      .addCase(updateLiveScores.pending, (state, action) => {
        const { matchId } = action.meta.arg;
        state.loading[matchId] = true;
        delete state.error[matchId];
      })
      .addCase(updateLiveScores.fulfilled, (state, action) => {
        const { matchId, matchData, updatedTeams, lastUpdate } = action.payload;
        state.loading[matchId] = false;
        
        // Update match data
        state.matchData[matchId] = {
          ...matchData,
          lastUpdated: lastUpdate
        };
        
        // Update team scores
        state.teamScores[matchId] = {
          teams: updatedTeams,
          lastUpdate
        };
        
        // Update live match tracking info
        if (state.liveMatches[matchId]) {
          state.liveMatches[matchId].lastUpdate = lastUpdate;
        }
      })
      .addCase(updateLiveScores.rejected, (state, action) => {
        const { matchId } = action.meta.arg;
        state.loading[matchId] = false;
        state.error[matchId] = action.payload;
      });
  }
});

export const { clearMatchError, updateTeamScoresLocal, setMatchData } = liveMatchSlice.actions;

// Selectors
export const selectLiveMatchData = (state, matchId) => state.liveMatch.matchData[matchId];
export const selectTeamScores = (state, matchId) => state.liveMatch.teamScores[matchId]?.teams || [];
export const selectTeamScoresLastUpdate = (state, matchId) => state.liveMatch.teamScores[matchId]?.lastUpdate;
export const selectIsLiveTracking = (state, matchId) => state.liveMatch.liveMatches[matchId]?.isTracking || false;
export const selectLiveMatchLoading = (state, matchId) => state.liveMatch.loading[matchId] || false;
export const selectLiveMatchError = (state, matchId) => state.liveMatch.error[matchId];

export default liveMatchSlice.reducer;