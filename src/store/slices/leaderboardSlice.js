import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for leaderboard
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ tournamentId, matchId }, { rejectWithValue }) => {
    try {
      let url = '/api/leaderboard';
      
      if (tournamentId && matchId) {
        url = `/api/tournaments/${tournamentId}/matches/${matchId}/leaderboard`;
      } else if (tournamentId) {
        url = `/api/tournaments/${tournamentId}/leaderboard`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async ({ tournamentId, matchId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      let url = `/api/user/rank`;
      if (tournamentId && matchId) {
        url = `/api/tournaments/${tournamentId}/matches/${matchId}/user/rank`;
      } else if (tournamentId) {
        url = `/api/tournaments/${tournamentId}/user/rank`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user rank');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMatchResults = createAsyncThunk(
  'leaderboard/fetchMatchResults',
  async ({ tournamentId, matchId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}/results`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch match results');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  leaderboard: [],
  userRank: null,
  matchResults: null,
  totalParticipants: 0,
  prizePool: 0,
  isLoading: false,
  error: null,
  filters: {
    view: 'overall', // overall, friends, leagues
  },
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLeaderboardFilter: (state, action) => {
      state.filters.view = action.payload;
    },
    clearLeaderboard: (state) => {
      state.leaderboard = [];
      state.userRank = null;
      state.matchResults = null;
      state.totalParticipants = 0;
      state.prizePool = 0;
    },
    updateUserPoints: (state, action) => {
      const { points } = action.payload;
      if (state.userRank) {
        state.userRank.points = points;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload.leaderboard;
        state.totalParticipants = action.payload.totalParticipants;
        state.prizePool = action.payload.prizePool;
        state.error = null;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user rank
      .addCase(fetchUserRank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRank = action.payload;
        state.error = null;
      })
      .addCase(fetchUserRank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch match results
      .addCase(fetchMatchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchResults = action.payload;
        state.error = null;
      })
      .addCase(fetchMatchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTopRankers = (state, count = 10) => {
  return state.leaderboard.leaderboard.slice(0, count);
};

export const selectUserPosition = (state) => {
  if (!state.leaderboard.userRank) return null;
  
  return {
    rank: state.leaderboard.userRank.rank,
    points: state.leaderboard.userRank.points,
    percentile: ((state.leaderboard.totalParticipants - state.leaderboard.userRank.rank) / state.leaderboard.totalParticipants) * 100
  };
};

export const { clearError, setLeaderboardFilter, clearLeaderboard, updateUserPoints } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;