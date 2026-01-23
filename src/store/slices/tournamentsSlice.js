import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tournamentsAPI } from '../../services/api';

// Async thunks for tournaments
export const fetchTournaments = createAsyncThunk(
  'tournaments/fetchTournaments',
  async (params, { rejectWithValue }) => {
    const queryParams = params || {};
    try {
      const response = await tournamentsAPI.getAll(queryParams);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tournaments');
    }
  }
);

export const fetchTournamentById = createAsyncThunk(
  'tournaments/fetchTournamentById',
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await tournamentsAPI.getById(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tournament details');
    }
  }
);

export const fetchTournamentMatches = createAsyncThunk(
  'tournaments/fetchTournamentMatches',
  async ({ tournamentId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await tournamentsAPI.getMatches(tournamentId, params);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tournament matches');
    }
  }
);

export const fetchTournamentLeaderboard = createAsyncThunk(
  'tournaments/fetchTournamentLeaderboard',
  async ({ tournamentId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await tournamentsAPI.getLeaderboard(tournamentId, params);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tournament leaderboard');
    }
  }
);

export const joinTournament = createAsyncThunk(
  'tournaments/joinTournament',
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await tournamentsAPI.join(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to join tournament');
    }
  }
);

export const leaveTournament = createAsyncThunk(
  'tournaments/leaveTournament',
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await tournamentsAPI.leave(tournamentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to leave tournament');
    }
  }
);

const initialState = {
  tournaments: [],
  currentTournament: null,
  tournamentMatches: [],
  tournamentLeaderboard: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all', // all, ongoing, upcoming, completed
    type: 'all', // all, T20, ODI, Test
  },
};

const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    clearCurrentTournament: (state) => {
      state.currentTournament = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tournaments
    builder
      .addCase(fetchTournaments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTournaments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournaments = action.payload;
        state.error = null;
      })
      .addCase(fetchTournaments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tournament by ID
      .addCase(fetchTournamentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTournamentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTournament = action.payload;
        state.error = null;
      })
      .addCase(fetchTournamentById.rejected, (state, action) => {
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
        state.tournamentMatches = action.payload;
        state.error = null;
      })
      .addCase(fetchTournamentMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch tournament leaderboard
      .addCase(fetchTournamentLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTournamentLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tournamentLeaderboard = action.payload;
        state.error = null;
      })
      .addCase(fetchTournamentLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Join tournament
      .addCase(joinTournament.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinTournament.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // You might want to update the tournament data here
      })
      .addCase(joinTournament.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Leave tournament
      .addCase(leaveTournament.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveTournament.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // You might want to update the tournament data here
      })
      .addCase(leaveTournament.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectFilteredTournaments = (state) => {
  const { tournaments, filters } = state.tournaments;
  
  return tournaments.filter(tournament => {
    if (filters.status !== 'all' && tournament.status !== filters.status) {
      return false;
    }
    if (filters.type !== 'all' && tournament.type !== filters.type) {
      return false;
    }
    return true;
  });
};

export const { clearError, setFilter, clearCurrentTournament } = tournamentsSlice.actions;
export default tournamentsSlice.reducer;