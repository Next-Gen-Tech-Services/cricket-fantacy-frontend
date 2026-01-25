import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaguesAPI } from '../../services/api';

// Async thunks
export const fetchLeagues = createAsyncThunk(
  'leagues/fetchLeagues',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leagues');
    }
  }
);

export const fetchLeagueById = createAsyncThunk(
  'leagues/fetchLeagueById',
  async (leagueId, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.getById(leagueId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch league');
    }
  }
);

export const createLeague = createAsyncThunk(
  'leagues/createLeague',
  async (leagueData, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.create(leagueData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create league');
    }
  }
);

export const joinLeague = createAsyncThunk(
  'leagues/joinLeague',
  async ({ leagueId, joinData = {} }, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.join(leagueId, joinData);
      return { leagueId, response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to join league');
    }
  }
);

export const leaveLeague = createAsyncThunk(
  'leagues/leaveLeague',
  async (leagueId, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.leave(leagueId);
      return { leagueId, response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to leave league');
    }
  }
);

export const fetchMyLeagues = createAsyncThunk(
  'leagues/fetchMyLeagues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.getMyLeagues();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch my leagues');
    }
  }
);

export const fetchLeagueLeaderboard = createAsyncThunk(
  'leagues/fetchLeagueLeaderboard',
  async ({ leagueId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await leaguesAPI.getLeaderboard(leagueId, params);
      return { leagueId, leaderboard: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch league leaderboard');
    }
  }
);

const initialState = {
  leagues: [],
  myLeagues: [],
  selectedLeague: null,
  leaderboards: {},
  loading: false,
  error: null,
  creating: false,
  joining: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLeague: (state) => {
      state.selectedLeague = null;
    },
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLeagueFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch leagues
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = { ...state.pagination, ...action.payload.pagination };
        }
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch league by ID
      .addCase(fetchLeagueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagueById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLeague = action.payload.data;
      })
      .addCase(fetchLeagueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create league
      .addCase(createLeague.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createLeague.fulfilled, (state, action) => {
        state.creating = false;
        state.leagues.unshift(action.payload.data);
        state.myLeagues.unshift(action.payload.data);
      })
      .addCase(createLeague.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // Join league
      .addCase(joinLeague.pending, (state) => {
        state.joining = true;
        state.error = null;
      })
      .addCase(joinLeague.fulfilled, (state, action) => {
        state.joining = false;
        // Update league in the state
        if (state.selectedLeague && state.selectedLeague._id === action.payload.leagueId) {
          state.selectedLeague.hasJoined = true;
          if (state.selectedLeague.currentMembers !== undefined) {
            state.selectedLeague.currentMembers += 1;
          }
        }
        // Add to my leagues if not already there
        const existsInMyLeagues = state.myLeagues.find(l => l._id === action.payload.leagueId);
        if (!existsInMyLeagues && action.payload.response.data) {
          state.myLeagues.push(action.payload.response.data);
        }
      })
      .addCase(joinLeague.rejected, (state, action) => {
        state.joining = false;
        state.error = action.payload;
      })
      
      // Leave league
      .addCase(leaveLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveLeague.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from my leagues
        state.myLeagues = state.myLeagues.filter(l => l._id !== action.payload.leagueId);
        // Update selected league
        if (state.selectedLeague && state.selectedLeague._id === action.payload.leagueId) {
          state.selectedLeague.hasJoined = false;
          if (state.selectedLeague.currentMembers !== undefined) {
            state.selectedLeague.currentMembers -= 1;
          }
        }
      })
      .addCase(leaveLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch my leagues
      .addCase(fetchMyLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.myLeagues = action.payload.data || [];
      })
      .addCase(fetchMyLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch league leaderboard
      .addCase(fetchLeagueLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagueLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards[action.payload.leagueId] = action.payload.leaderboard;
      })
      .addCase(fetchLeagueLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSelectedLeague, 
  updatePagination, 
  setLeagueFilter 
} = leaguesSlice.actions;

export default leaguesSlice.reducer;