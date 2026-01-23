# Redux Setup for Cricket Fantasy App

This document explains how to use Redux in your cricket fantasy application.

## 📁 Store Structure

```
src/store/
├── index.js              # Store configuration
├── hooks.js              # Custom Redux hooks
├── api.js                # API utilities and mock data
└── slices/
    ├── authSlice.js      # Authentication state
    ├── tournamentsSlice.js # Tournaments data
    ├── matchesSlice.js    # Matches data
    ├── teamsSlice.js     # Team building and user teams
    └── leaderboardSlice.js # Rankings and results
```

## 🚀 Quick Start

### 1. Using Redux Hooks

```jsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTournaments } from '../store/slices/tournamentsSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { tournaments, isLoading } = useAppSelector(state => state.tournaments);
  
  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);
  
  return <div>{/* Your component */}</div>;
};
```

### 2. Authentication

```jsx
import { loginUser, checkAuth, logoutUser } from '../store/slices/authSlice';

// Login
const handleLogin = async (credentials) => {
  try {
    await dispatch(loginUser(credentials)).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// Check auth on app load
useEffect(() => {
  dispatch(checkAuth());
}, []);

// Logout
const handleLogout = () => {
  dispatch(logoutUser());
};
```

### 3. Tournament Management

```jsx
import { fetchTournaments, setFilter } from '../store/slices/tournamentsSlice';

// Fetch tournaments
dispatch(fetchTournaments());

// Filter tournaments
dispatch(setFilter({ filterType: 'status', value: 'live' }));

// Get filtered tournaments
const filteredTournaments = useAppSelector(selectFilteredTournaments);
```

### 4. Team Building

```jsx
import { 
  addPlayerToTeam, 
  removePlayerFromTeam, 
  setCaptain,
  setViceCaptain 
} from '../store/slices/teamsSlice';

// Add player to team
dispatch(addPlayerToTeam(player));

// Remove player from team
dispatch(removePlayerFromTeam(playerId));

// Set captain
dispatch(setCaptain(playerId));

// Set vice-captain
dispatch(setViceCaptain(playerId));
```

### 5. Leaderboard

```jsx
import { fetchLeaderboard, fetchUserRank } from '../store/slices/leaderboardSlice';

// Fetch leaderboard for a specific match
dispatch(fetchLeaderboard({ tournamentId, matchId }));

// Fetch user's rank
dispatch(fetchUserRank({ tournamentId, matchId }));
```

## 📊 State Structure

### Auth State
```javascript
{
  user: null | User,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

### Tournaments State
```javascript
{
  tournaments: Tournament[],
  currentTournament: Tournament | null,
  isLoading: boolean,
  error: string | null,
  filters: {
    status: 'all' | 'live' | 'upcoming' | 'completed',
    type: 'all' | 'T20' | 'ODI' | 'Test'
  }
}
```

### Teams State
```javascript
{
  userTeams: Team[],
  currentTeam: Team | null,
  availablePlayers: Player[],
  selectedPlayers: Player[],
  budget: number,
  remainingBudget: number,
  isLoading: boolean,
  error: string | null
}
```

## 🔄 Async Actions

All async actions return promises that can be handled with `.unwrap()`:

```jsx
try {
  const result = await dispatch(loginUser(credentials)).unwrap();
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error);
}
```

## 🛠 API Integration

Update the API endpoints in `src/store/api.js`:

```javascript
export const API_BASE_URL = 'https://your-api-url.com';
```

Replace mock data with real API calls in the slice files.

## 📱 Component Integration Examples

### Tournament List Component
```jsx
const TournamentList = () => {
  const dispatch = useAppDispatch();
  const { tournaments, isLoading, filters } = useAppSelector(state => state.tournaments);
  const filteredTournaments = useAppSelector(selectFilteredTournaments);
  
  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);
  
  return (
    <div>
      <select 
        value={filters.status} 
        onChange={(e) => dispatch(setFilter({ filterType: 'status', value: e.target.value }))}
      >
        <option value="all">All Tournaments</option>
        <option value="live">Live</option>
        <option value="upcoming">Upcoming</option>
      </select>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        filteredTournaments.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))
      )}
    </div>
  );
};
```

### Team Builder Component
```jsx
const TeamBuilder = ({ matchId }) => {
  const dispatch = useAppDispatch();
  const { selectedPlayers, remainingBudget, availablePlayers } = useAppSelector(state => state.teams);
  
  useEffect(() => {
    dispatch(fetchAvailablePlayers(matchId));
  }, [matchId, dispatch]);
  
  const handleAddPlayer = (player) => {
    dispatch(addPlayerToTeam(player));
  };
  
  return (
    <div>
      <div>Budget: ${remainingBudget}</div>
      <div>Selected: {selectedPlayers.length}/11</div>
      
      {availablePlayers.map(player => (
        <PlayerCard 
          key={player.id} 
          player={player} 
          onAdd={() => handleAddPlayer(player)}
        />
      ))}
    </div>
  );
};
```

## 🔧 Customization

1. **Add new slices**: Create new slice files in `src/store/slices/`
2. **Update store**: Add new reducers to `src/store/index.js`
3. **Create selectors**: Add memoized selectors for complex state calculations
4. **Add middleware**: Configure additional middleware in the store

## 📝 Best Practices

1. Use `useAppSelector` and `useAppDispatch` instead of the default hooks
2. Handle loading and error states in your components
3. Use `.unwrap()` with async actions for proper error handling
4. Keep your slices focused on specific domains
5. Use selectors for derived state calculations
6. Clear errors when appropriate using the `clearError` actions

## 🐛 Debugging

Install Redux DevTools Extension for debugging:
- [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

The store is already configured to work with Redux DevTools.