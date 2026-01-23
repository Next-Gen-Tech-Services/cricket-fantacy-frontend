import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { playersAPI } from '../../services/api';

// Async thunks for players
export const fetchPlayers = createAsyncThunk(
  'players/fetchPlayers',
  async (params, { rejectWithValue }) => {
    const queryParams = params || {};
    try {
      const response = await playersAPI.getAll(queryParams);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch players');
    }
  }
);

export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (playerId, { rejectWithValue }) => {
    try {
      const response = await playersAPI.getById(playerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch player details');
    }
  }
);

export const fetchPlayerStats = createAsyncThunk(
  'players/fetchPlayerStats',
  async (playerId, { rejectWithValue }) => {
    try {
      const response = await playersAPI.getStats(playerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch player statistics');
    }
  }
);

export const fetchPlayersByTeam = createAsyncThunk(
  'players/fetchPlayersByTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await playersAPI.getByTeam(teamId);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch players by team');
    }
  }
);

export const fetchPlayersByRole = createAsyncThunk(
  'players/fetchPlayersByRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await playersAPI.getByRole(role);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch players by role');
    }
  }
);

const initialState = {
  players: [],
  currentPlayer: null,
  playerStats: null,
  teamPlayers: [],
  rolePlayers: [],
  isLoading: false,
  error: null,
  filters: {
    team: null,
    role: null,
    search: '',
    sortBy: 'name', // name, points, price, form
    sortOrder: 'asc', // asc, desc
  },
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlayer: (state) => {
      state.currentPlayer = null;
      state.playerStats = null;
    },
    clearTeamPlayers: (state) => {
      state.teamPlayers = [];
    },
    clearRolePlayers: (state) => {
      state.rolePlayers = [];
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
      // Fetch all players
      .addCase(fetchPlayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch player by ID
      .addCase(fetchPlayerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlayer = action.payload;
      })
      .addCase(fetchPlayerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch player stats
      .addCase(fetchPlayerStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayerStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playerStats = action.payload;
      })
      .addCase(fetchPlayerStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch players by team
      .addCase(fetchPlayersByTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayersByTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamPlayers = action.payload;
      })
      .addCase(fetchPlayersByTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch players by role
      .addCase(fetchPlayersByRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlayersByRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rolePlayers = action.payload;
      })
      .addCase(fetchPlayersByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentPlayer, 
  clearTeamPlayers, 
  clearRolePlayers, 
  setFilters, 
  resetFilters 
} = playersSlice.actions;

export default playersSlice.reducer;