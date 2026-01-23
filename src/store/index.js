import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import tournamentsSlice from './slices/tournamentsSlice';
import matchesSlice from './slices/matchesSlice';
import teamsSlice from './slices/teamsSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import fantasyTeamsSlice from './slices/fantasyTeamsSlice';
import playersSlice from './slices/playersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tournaments: tournamentsSlice,
    matches: matchesSlice,
    teams: teamsSlice,
    leaderboard: leaderboardSlice,
    fantasyTeams: fantasyTeamsSlice,
    players: playersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});