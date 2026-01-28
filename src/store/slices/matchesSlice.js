import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { matchesAPI, tournamentsAPI } from '../../services/api';

// Async thunks for matches
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (params, { rejectWithValue }) => {
    const queryParams = params || {};
    try {
      const response = await matchesAPI.getAll(queryParams);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch matches');
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchesAPI.getById(matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch match details');
    }
  }
);

export const fetchLiveMatches = createAsyncThunk(
  'matches/fetchLiveMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await matchesAPI.getLive();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch live matches');
    }
  }
);

export const fetchUpcomingMatches = createAsyncThunk(
  'matches/fetchUpcomingMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await matchesAPI.getUpcoming();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming matches');
    }
  }
);

export const fetchCompletedMatches = createAsyncThunk(
  'matches/fetchCompletedMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await matchesAPI.getCompleted();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch completed matches');
    }
  }
);

export const fetchMatchLeaderboard = createAsyncThunk(
  'matches/fetchMatchLeaderboard',
  async ({ matchId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await matchesAPI.getLeaderboard(matchId, params);
      const responseData = response.data || {};
      return { 
        matchId, 
        data: responseData.leaderboard || [],
        userPosition: responseData.userTeam || null,
        prizePool: responseData.prizePool || null,
        pagination: responseData.pagination || null
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch match leaderboard');
    }
  }
);

export const fetchMatchPlayers = createAsyncThunk(
  'matches/fetchMatchPlayers',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await matchesAPI.getPlayers(matchId);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch match players');
    }
  }
);

// Async thunks for tournament matches
export const fetchTournamentMatches = createAsyncThunk(
  'matches/fetchTournamentMatches',
  async ({ tournamentId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await tournamentsAPI.getMatches(tournamentId, params);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tournament matches');
    }
  }
);

const initialState = {
  matches: [],
  liveMatches: [],
  currentMatch: null,
  leaderboards: {}, // matchId -> leaderboard data
  isLoading: false,
  error: null,
  filters: {
    status: 'all', // all, live, upcoming, completed
    date: null,
  },
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setMatchFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
    updateMatchStatus: (state, action) => {
      const { matchId, status, score } = action.payload;
      const match = state.matches.find(m => m.id === matchId);
      if (match) {
        match.status = status;
        if (score) {
          match.score = score;
        }
      }
      
      // Also update current match if it matches
      if (state.currentMatch && state.currentMatch.id === matchId) {
        state.currentMatch.status = status;
        if (score) {
          state.currentMatch.score = score;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch matches
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch match by ID
      .addCase(fetchMatchById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMatch = action.payload;
        state.error = null;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch live matches
      .addCase(fetchLiveMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLiveMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.liveMatches = action.payload;
        state.error = null;
      })
      .addCase(fetchLiveMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch upcoming matches
      .addCase(fetchUpcomingMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch completed matches
      .addCase(fetchCompletedMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompletedMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(fetchCompletedMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch match leaderboard
      .addCase(fetchMatchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const { matchId, data, userPosition, prizePool, pagination } = action.payload;
        state.leaderboards[matchId] = {
          data,
          userPosition,
          prizePool,
          pagination,
          lastUpdated: Date.now()
        };
      })
      .addCase(fetchMatchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch match players
      .addCase(fetchMatchPlayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchPlayers.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchMatchPlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch tournament matches
      .addCase(fetchTournamentMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTournamentMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(fetchTournamentMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectFilteredMatches = (state) => {
  const { matches, filters } = state.matches;
  
  return matches.filter(match => {
    if (filters.status !== 'all' && match.status !== filters.status) {
      return false;
    }
    if (filters.date && match.date !== filters.date) {
      return false;
    }
    return true;
  });
};

export const { clearError, setMatchFilter, clearCurrentMatch, updateMatchStatus } = matchesSlice.actions;
export default matchesSlice.reducer;