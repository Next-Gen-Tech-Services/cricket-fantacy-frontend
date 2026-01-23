import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for teams
export const fetchUserTeams = createAsyncThunk(
  'teams/fetchUserTeams',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/user/teams', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user teams');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(teamData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create team');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ teamId, teamData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(teamData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update team');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (teamId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete team');
      }
      
      return teamId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAvailablePlayers = createAsyncThunk(
  'teams/fetchAvailablePlayers',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/players`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available players');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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