import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardAPI } from '../../services/api';

// Async thunks for leaderboard
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ tournamentId, matchId, contestId, leagueId }, { rejectWithValue }) => {
    try {
      let response;
      
      if (contestId) {
        response = await leaderboardAPI.getContest(contestId);
      } else if (tournamentId && matchId) {
        response = await leaderboardAPI.getMatch(matchId);
      } else if (tournamentId) {
        response = await leaderboardAPI.getTournament(tournamentId);
      } else if (leagueId) {
        response = await leaderboardAPI.getLeague(leagueId);
      } else {
        response = await leaderboardAPI.getGlobal();
      }
      
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async ({ userId, type = 'global' }, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getUserRank(userId, type);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user rank');
    }
  }
);

export const fetchMatchResults = createAsyncThunk(
  'leaderboard/fetchMatchResults',
  async ({ matchId }, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getMatch(matchId);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch match results');
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