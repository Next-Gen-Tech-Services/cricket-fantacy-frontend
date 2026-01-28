import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fantasyTeamsAPI } from '../../services/api';

// Async thunks for fantasy teams
export const fetchMyFantasyTeams = createAsyncThunk(
  'fantasyTeams/fetchMyFantasyTeams',
  async (params, { rejectWithValue }) => {
    const queryParams = params || {};
    try {
      const response = await fantasyTeamsAPI.getMyTeams(queryParams);
      console.log('🚀 fetchMyFantasyTeams: API Response:', response);
      
      // Handle different response formats:
      // 1. Direct array: response = [teams...]
      // 2. Object with teams: response = { teams: [...], pagination: {...} }
      // 3. Nested data: response = { data: { teams: [...], pagination: {...} } }
      let teams = [];
      
      if (Array.isArray(response)) {
        teams = response;
      } else if (response.data?.teams) {
        teams = response.data.teams;
      } else if (response.teams) {
        teams = response.teams;
      } else if (response.data && Array.isArray(response.data)) {
        teams = response.data;
      }
      
      console.log('✅ fetchMyFantasyTeams: Extracted teams:', teams);
      console.log('✅ fetchMyFantasyTeams: Teams count:', teams.length);
      
      return teams;
    } catch (error) {
      console.error('❌ fetchMyFantasyTeams: Error:', error);
      return rejectWithValue(error.message || 'Failed to fetch fantasy teams');
    }
  }
);

export const fetchFantasyTeamById = createAsyncThunk(
  'fantasyTeams/fetchFantasyTeamById',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.getById(teamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch fantasy team');
    }
  }
);

export const createFantasyTeam = createAsyncThunk(
  'fantasyTeams/createFantasyTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.create(teamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create fantasy team');
    }
  }
);

export const updateFantasyTeam = createAsyncThunk(
  'fantasyTeams/updateFantasyTeam',
  async ({ teamId, teamData }, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.update(teamId, teamData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update fantasy team');
    }
  }
);

export const deleteFantasyTeam = createAsyncThunk(
  'fantasyTeams/deleteFantasyTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      await fantasyTeamsAPI.delete(teamId);
      return teamId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete fantasy team');
    }
  }
);

export const submitFantasyTeam = createAsyncThunk(
  'fantasyTeams/submitFantasyTeam',
  async ({ teamId, matchId }, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.submit(teamId, matchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit fantasy team');
    }
  }
);

export const fetchFantasyTeamPerformance = createAsyncThunk(
  'fantasyTeams/fetchFantasyTeamPerformance',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.getPerformance(teamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch team performance');
    }
  }
);

const initialState = {
  teams: [],
  currentTeam: null,
  teamPerformance: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isSubmitting: false,
  error: null,
  filters: {
    match: null,
    tournament: null,
    status: 'all', // all, draft, submitted, active
  },
};

const fantasyTeamsSlice = createSlice({
  name: 'fantasyTeams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTeam: (state) => {
      state.currentTeam = null;
    },
    clearTeamPerformance: (state) => {
      state.teamPerformance = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my fantasy teams
      .addCase(fetchMyFantasyTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyFantasyTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(fetchMyFantasyTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch fantasy team by ID
      .addCase(fetchFantasyTeamById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFantasyTeamById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeam = action.payload;
      })
      .addCase(fetchFantasyTeamById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create fantasy team
      .addCase(createFantasyTeam.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createFantasyTeam.fulfilled, (state, action) => {
        state.isCreating = false;
        state.teams.unshift(action.payload);
        state.currentTeam = action.payload;
      })
      .addCase(createFantasyTeam.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // Update fantasy team
      .addCase(updateFantasyTeam.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateFantasyTeam.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.teams.findIndex(team => team._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?._id === action.payload._id) {
          state.currentTeam = action.payload;
        }
      })
      .addCase(updateFantasyTeam.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // Delete fantasy team
      .addCase(deleteFantasyTeam.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteFantasyTeam.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.teams = state.teams.filter(team => team._id !== action.payload);
        if (state.currentTeam?._id === action.payload) {
          state.currentTeam = null;
        }
      })
      .addCase(deleteFantasyTeam.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })

      // Submit fantasy team
      .addCase(submitFantasyTeam.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitFantasyTeam.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.teams.findIndex(team => team._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?._id === action.payload._id) {
          state.currentTeam = action.payload;
        }
      })
      .addCase(submitFantasyTeam.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Fetch team performance
      .addCase(fetchFantasyTeamPerformance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFantasyTeamPerformance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamPerformance = action.payload;
      })
      .addCase(fetchFantasyTeamPerformance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentTeam, 
  clearTeamPerformance, 
  setFilters, 
  resetFilters 
} = fantasyTeamsSlice.actions;

export default fantasyTeamsSlice.reducer;