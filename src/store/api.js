// API Configuration and Utilities for Redux
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  CHECK_AUTH: '/api/auth/me',
  LOGOUT: '/api/auth/logout',
  
  // Tournaments
  TOURNAMENTS: '/api/tournaments',
  TOURNAMENT_BY_ID: (id) => `/api/tournaments/${id}`,
  
  // Matches
  MATCHES: '/api/matches',
  LIVE_MATCHES: '/api/matches/live',
  TOURNAMENT_MATCHES: (tournamentId) => `/api/tournaments/${tournamentId}/matches`,
  MATCH_BY_ID: (tournamentId, matchId) => `/api/tournaments/${tournamentId}/matches/${matchId}`,
  
  // Players
  MATCH_PLAYERS: (matchId) => `/api/matches/${matchId}/players`,
  
  // Teams
  USER_TEAMS: '/api/user/teams',
  TEAMS: '/api/teams',
  TEAM_BY_ID: (id) => `/api/teams/${id}`,
  
  // Leaderboard
  LEADERBOARD: '/api/leaderboard',
  TOURNAMENT_LEADERBOARD: (tournamentId) => `/api/tournaments/${tournamentId}/leaderboard`,
  MATCH_LEADERBOARD: (tournamentId, matchId) => `/api/tournaments/${tournamentId}/matches/${matchId}/leaderboard`,
  USER_RANK: '/api/user/rank',
  TOURNAMENT_USER_RANK: (tournamentId) => `/api/tournaments/${tournamentId}/user/rank`,
  MATCH_USER_RANK: (tournamentId, matchId) => `/api/tournaments/${tournamentId}/matches/${matchId}/user/rank`,
  
  // Results
  MATCH_RESULTS: (tournamentId, matchId) => `/api/tournaments/${tournamentId}/matches/${matchId}/results`,
};

// Helper function to create authenticated headers
export const createAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Helper function for making API requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Mock data for development (remove when connecting to real API)
export const MOCK_DATA = {
  tournaments: [
    {
      id: 1,
      name: "ICC Cricket World Cup 2026",
      type: "International",
      startDate: "2026-02-10",
      endDate: "2026-03-29",
      status: "upcoming",
      teams: 10,
      matches: 48,
      prize: "$10 Million",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
      description: "The biggest cricket tournament in the world"
    },
    {
      id: 2,
      name: "Indian Premier League 2026",
      type: "T20 League",
      startDate: "2026-03-20",
      endDate: "2026-05-26",
      status: "live",
      teams: 10,
      matches: 74,
      prize: "$5 Million",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      description: "India's premier T20 cricket league"
    },
  ],
  
  matches: [
    {
      id: 1,
      tournamentId: 2,
      team1: "Mumbai Indians",
      team2: "Chennai Super Kings",
      date: "2026-01-25",
      time: "19:30",
      venue: "Wankhede Stadium",
      status: "upcoming",
      type: "T20",
    },
    {
      id: 2,
      tournamentId: 2,
      team1: "Royal Challengers Bangalore",
      team2: "Delhi Capitals",
      date: "2026-01-26",
      time: "15:30",
      venue: "M. Chinnaswamy Stadium",
      status: "live",
      type: "T20",
    },
  ],
  
  players: [
    {
      id: 1,
      name: "Virat Kohli",
      team: "RCB",
      role: "Batsman",
      price: 15,
      points: 85,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "MS Dhoni",
      team: "CSK",
      role: "Wicket-keeper",
      price: 12,
      points: 78,
      image: "/api/placeholder/100/100"
    },
  ]
};

// Error handling helper
export const handleAsyncError = (error) => {
  console.error('API Error:', error);
  
  if (error.message === 'Failed to fetch') {
    return 'Network error. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};