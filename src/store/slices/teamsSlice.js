import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fantasyTeamsAPI, playersAPI } from '../../services/api';

// Async thunks for teams
export const fetchUserTeams = createAsyncThunk(
  'teams/fetchUserTeams',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.getMyTeams(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user teams');
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.create(teamData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ teamId, teamData }, { rejectWithValue }) => {
    try {
      const response = await fantasyTeamsAPI.update(teamId, teamData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update team');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      await fantasyTeamsAPI.delete(teamId);
      return teamId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete team');
    }
  }
);

export const fetchAvailablePlayers = createAsyncThunk(
  'teams/fetchAvailablePlayers',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await playersAPI.getAll({ matchId });
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available players');
    }
  }
);

const initialState = {
  userTeams: [],
  currentTeam: null,
  availablePlayers: [],
  selectedPlayers: [],
  teamStats: null,
  isLoading: false,
  error: null,
  budget: 100, // Default budget
  remainingBudget: 100,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    clearCurrentTeam: (state) => {
      state.currentTeam = null;
      state.selectedPlayers = [];
      state.remainingBudget = state.budget;
    },
    addPlayerToTeam: (state, action) => {
      const player = action.payload;
      const isAlreadySelected = state.selectedPlayers.some(p => p.id === player.id);
      
      if (!isAlreadySelected && state.selectedPlayers.length < 11 && state.remainingBudget >= player.price) {
        state.selectedPlayers.push(player);
        state.remainingBudget -= player.price;
      }
    },
    removePlayerFromTeam: (state, action) => {
      const playerId = action.payload;
      const playerIndex = state.selectedPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const removedPlayer = state.selectedPlayers[playerIndex];
        state.selectedPlayers.splice(playerIndex, 1);
        state.remainingBudget += removedPlayer.price;
      }
    },
    setCaptain: (state, action) => {
      const playerId = action.payload;
      // Reset all players captain status
      state.selectedPlayers.forEach(player => {
        player.isCaptain = false;
        player.isViceCaptain = false;
      });
      
      // Set new captain
      const captain = state.selectedPlayers.find(p => p.id === playerId);
      if (captain) {
        captain.isCaptain = true;
      }
    },
    setViceCaptain: (state, action) => {
      const playerId = action.payload;
      // Reset all players vice-captain status (except captain)
      state.selectedPlayers.forEach(player => {
        if (!player.isCaptain) {
          player.isViceCaptain = false;
        }
      });
      
      // Set new vice-captain
      const viceCaptain = state.selectedPlayers.find(p => p.id === playerId);
      if (viceCaptain && !viceCaptain.isCaptain) {
        viceCaptain.isViceCaptain = true;
      }
    },
    resetTeamBuilder: (state) => {
      state.selectedPlayers = [];
      state.remainingBudget = state.budget;
      state.currentTeam = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user teams
    builder
      .addCase(fetchUserTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTeams = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create team
      .addCase(createTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTeams.push(action.payload);
        state.error = null;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update team
      .addCase(updateTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.userTeams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.userTeams[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete team
      .addCase(deleteTeam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTeams = state.userTeams.filter(team => team.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch available players
      .addCase(fetchAvailablePlayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePlayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availablePlayers = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailablePlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTeamByMatchId = (state, matchId) => {
  return state.teams.userTeams.find(team => team.matchId === matchId);
};

export const selectPlayersByRole = (state, role) => {
  return state.teams.availablePlayers.filter(player => player.role === role);
};

export const { 
  clearError, 
  setCurrentTeam, 
  clearCurrentTeam, 
  addPlayerToTeam, 
  removePlayerFromTeam, 
  setCaptain, 
  setViceCaptain, 
  resetTeamBuilder 
} = teamsSlice.actions;

export default teamsSlice.reducer;