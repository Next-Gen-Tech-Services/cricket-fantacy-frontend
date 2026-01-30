import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import tournamentsSlice from './slices/tournamentsSlice';
import matchesSlice from './slices/matchesSlice';
import teamsSlice from './slices/teamsSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import fantasyTeamsSlice from './slices/fantasyTeamsSlice';
import playersSlice from './slices/playersSlice';
import contestsSlice from './slices/contestsSlice';
import leaguesSlice from './slices/leaguesSlice';
import liveMatchSlice from './slices/liveMatchSlice';
import matchStatsSlice from './slices/matchStatsSlice';
import { userApi } from '../api/userApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tournaments: tournamentsSlice,
    matches: matchesSlice,
    teams: teamsSlice,
    leaderboard: leaderboardSlice,
    fantasyTeams: fantasyTeamsSlice,
    players: playersSlice,
    contests: contestsSlice,
    leagues: leaguesSlice,
    liveMatch: liveMatchSlice,
    matchStats: matchStatsSlice,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(userApi.middleware),
});

// Export store for use in components
export default store;