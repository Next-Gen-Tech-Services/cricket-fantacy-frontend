import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contestsAPI } from '../../services/api';

// Async thunks
export const fetchContests = createAsyncThunk(
  'contests/fetchContests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await contestsAPI.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contests');
    }
  }
);

export const fetchContestsByMatch = createAsyncThunk(
  'contests/fetchContestsByMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await contestsAPI.getByMatch(matchId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contests for match');
    }
  }
);

export const fetchContestById = createAsyncThunk(
  'contests/fetchContestById',
  async (contestId, { rejectWithValue }) => {
    try {
      const response = await contestsAPI.getById(contestId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contest');
    }
  }
);

export const joinContest = createAsyncThunk(
  'contests/joinContest',
  async ({ contestId, teamId }, { rejectWithValue }) => {
    try {
      const response = await contestsAPI.join(contestId, teamId);
      return { contestId, response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to join contest');
    }
  }
);

export const fetchMyContests = createAsyncThunk(
  'contests/fetchMyContests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await contestsAPI.getAll({ ...params, myContests: true });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch my contests');
    }
  }
);

export const fetchContestLeaderboard = createAsyncThunk(
  'contests/fetchContestLeaderboard',
  async ({ contestId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await contestsAPI.getLeaderboard(contestId, params);
      return { contestId, leaderboard: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch contest leaderboard');
    }
  }
);

export const fetchMatchFantasyTeams = createAsyncThunk(
  'contests/fetchMatchFantasyTeams',
  async ({ matchId, params = {} }, { rejectWithValue }) => {
    try {
      const { fantasyTeamsAPI } = await import('../../services/api');
      console.log('🚀 fetchMatchFantasyTeams: Starting fetch for matchId:', matchId);
      console.log('🚀 fetchMatchFantasyTeams: API params:', { match: matchId, ...params });
      
      const response = await fantasyTeamsAPI.getAll({ match: matchId, ...params });
      console.log('✅ fetchMatchFantasyTeams: Success! Response:', response);
      
      // Handle both response formats:
      // 1. Direct array: response = [teams...]
      // 2. Object format: response = { teams: [...], pagination: {...} }
      const teams = Array.isArray(response) ? response : (response.data?.teams || response.teams || []);
      console.log('✅ fetchMatchFantasyTeams: Teams extracted:', teams);
      console.log('✅ fetchMatchFantasyTeams: Teams count:', teams.length);
      
      return { matchId, teams };
    } catch (error) {
      console.error('❌ fetchMatchFantasyTeams: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        matchId: matchId
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch fantasy teams for match';
      return rejectWithValue(`${errorMessage} (Match: ${matchId})`);
    }
  }
);

const initialState = {
  contests: [],
  myContests: [],
  selectedContest: null,
  contestsByMatch: {},
  leaderboards: {},
  matchFantasyTeams: {},
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

const contestsSlice = createSlice({
  name: 'contests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedContest: (state) => {
      state.selectedContest = null;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setContestFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch contests
      .addCase(fetchContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContests.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = { ...state.pagination, ...action.payload.pagination };
        }
      })
      .addCase(fetchContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch contests by match
      .addCase(fetchContestsByMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestsByMatch.fulfilled, (state, action) => {
        state.loading = false;
        const matchContests = action.payload.data || [];
        state.contestsByMatch[action.meta.arg] = matchContests;
      })
      .addCase(fetchContestsByMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch contest by ID
      .addCase(fetchContestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContest = action.payload.data;
      })
      .addCase(fetchContestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Join contest
      .addCase(joinContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinContest.fulfilled, (state, action) => {
        state.loading = false;
        // Update contest in the state if needed
        if (state.selectedContest && state.selectedContest._id === action.payload.contestId) {
          state.selectedContest.hasJoined = true;
          if (state.selectedContest.currentParticipants !== undefined) {
            state.selectedContest.currentParticipants += 1;
          }
        }
      })
      .addCase(joinContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch my contests
      .addCase(fetchMyContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyContests.fulfilled, (state, action) => {
        state.loading = false;
        state.myContests = action.payload.data || [];
      })
      .addCase(fetchMyContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch contest leaderboard
      .addCase(fetchContestLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards[action.payload.contestId] = action.payload.leaderboard;
      })
      .addCase(fetchContestLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch match fantasy teams
      .addCase(fetchMatchFantasyTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchFantasyTeams.fulfilled, (state, action) => {
        state.loading = false;
        const { matchId, teams } = action.payload;
        // Teams are already extracted in the thunk
        state.matchFantasyTeams[matchId] = teams || [];
      })
      .addCase(fetchMatchFantasyTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSelectedContest, 
  updatePagination, 
  setContestFilter 
} = contestsSlice.actions;

export default contestsSlice.reducer;