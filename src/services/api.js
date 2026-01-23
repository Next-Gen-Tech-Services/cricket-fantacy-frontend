import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ================= AUTH API =================
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  }
};

// ================= TOURNAMENTS API =================
export const tournamentsAPI = {
  // Get all tournaments
  getAll: async (params = {}) => {
    const response = await api.get('/tournaments', { params });
    return response.data;
  },

  // Get tournament by ID
  getById: async (tournamentId) => {
    const response = await api.get(`/tournaments/${tournamentId}`);
    return response.data;
  },

  // Get tournament matches
  getMatches: async (tournamentId, params = {}) => {
    const response = await api.get(`/tournaments/${tournamentId}/matches`, { params });
    return response.data;
  },

  // Get tournament leaderboard
  getLeaderboard: async (tournamentId, params = {}) => {
    const response = await api.get(`/tournaments/${tournamentId}/leaderboard`, { params });
    return response.data;
  },

  // Join tournament
  join: async (tournamentId) => {
    const response = await api.post(`/tournaments/${tournamentId}/join`);
    return response.data;
  },

  // Leave tournament
  leave: async (tournamentId) => {
    const response = await api.delete(`/tournaments/${tournamentId}/leave`);
    return response.data;
  }
};

// ================= MATCHES API =================
export const matchesAPI = {
  // Get all matches
  getAll: async (params = {}) => {
    const response = await api.get('/matches', { params });
    return response.data;
  },

  // Get match by ID
  getById: async (matchId) => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  // Get live matches
  getLive: async () => {
    const response = await api.get('/matches?status=ongoing');
    return response.data;
  },

  // Get upcoming matches
  getUpcoming: async () => {
    const response = await api.get('/matches?status=upcoming');
    return response.data;
  },

  // Get completed matches
  getCompleted: async () => {
    const response = await api.get('/matches?status=completed');
    return response.data;
  },

  // Get match leaderboard
  getLeaderboard: async (matchId, params = {}) => {
    const response = await api.get(`/matches/${matchId}/leaderboard`, { params });
    return response.data;
  },

  // Get match players
  getPlayers: async (matchId) => {
    const response = await api.get(`/matches/${matchId}/players`);
    return response.data;
  }
};

// ================= TEAMS API =================
export const teamsAPI = {
  // Get real teams
  getRealTeams: async () => {
    const response = await api.get('/teams');
    return response.data;
  },

  // Get real team by ID
  getRealTeamById: async (teamId) => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  // Get real team players
  getRealTeamPlayers: async (teamId) => {
    const response = await api.get(`/teams/${teamId}/players`);
    return response.data;
  }
};

// ================= FANTASY TEAMS API =================
export const fantasyTeamsAPI = {
  // Get user's fantasy teams
  getMyTeams: async (params = {}) => {
    const response = await api.get('/fantasy-teams', { params });
    return response.data;
  },

  // Get fantasy team by ID
  getById: async (teamId) => {
    const response = await api.get(`/fantasy-teams/${teamId}`);
    return response.data;
  },

  // Create fantasy team
  create: async (teamData) => {
    const response = await api.post('/fantasy-teams', teamData);
    return response.data;
  },

  // Update fantasy team
  update: async (teamId, teamData) => {
    const response = await api.put(`/fantasy-teams/${teamId}`, teamData);
    return response.data;
  },

  // Delete fantasy team
  delete: async (teamId) => {
    const response = await api.delete(`/fantasy-teams/${teamId}`);
    return response.data;
  },

  // Submit fantasy team for match
  submit: async (teamId, matchId) => {
    const response = await api.post(`/fantasy-teams/${teamId}/submit`, { matchId });
    return response.data;
  },

  // Get fantasy team performance
  getPerformance: async (teamId) => {
    const response = await api.get(`/fantasy-teams/${teamId}/performance`);
    return response.data;
  }
};

// ================= PLAYERS API =================
export const playersAPI = {
  // Get all players
  getAll: async (params = {}) => {
    const response = await api.get('/players', { params });
    return response.data;
  },

  // Get player by ID
  getById: async (playerId) => {
    const response = await api.get(`/players/${playerId}`);
    return response.data;
  },

  // Get player statistics
  getStats: async (playerId) => {
    const response = await api.get(`/players/${playerId}/stats`);
    return response.data;
  },

  // Get players by team
  getByTeam: async (teamId) => {
    const response = await api.get(`/players?team=${teamId}`);
    return response.data;
  },

  // Get players by role
  getByRole: async (role) => {
    const response = await api.get(`/players?role=${role}`);
    return response.data;
  }
};

// ================= LEAGUES API =================
export const leaguesAPI = {
  // Get all leagues
  getAll: async (params = {}) => {
    const response = await api.get('/leagues', { params });
    return response.data;
  },

  // Get league by ID
  getById: async (leagueId) => {
    const response = await api.get(`/leagues/${leagueId}`);
    return response.data;
  },

  // Join league
  join: async (leagueId, joinData = {}) => {
    const response = await api.post(`/leagues/${leagueId}/join`, joinData);
    return response.data;
  },

  // Leave league
  leave: async (leagueId) => {
    const response = await api.delete(`/leagues/${leagueId}/leave`);
    return response.data;
  },

  // Get league leaderboard
  getLeaderboard: async (leagueId, params = {}) => {
    const response = await api.get(`/leagues/${leagueId}/leaderboard`, { params });
    return response.data;
  },

  // Get user's leagues
  getMyLeagues: async () => {
    const response = await api.get('/leagues/my-leagues');
    return response.data;
  },

  // Create private league
  createPrivate: async (leagueData) => {
    const response = await api.post('/leagues/private', leagueData);
    return response.data;
  }
};

// ================= CONTESTS API =================
export const contestsAPI = {
  // Get all contests
  getAll: async (params = {}) => {
    const response = await api.get('/contests', { params });
    return response.data;
  },

  // Get contest by ID
  getById: async (contestId) => {
    const response = await api.get(`/contests/${contestId}`);
    return response.data;
  },

  // Join contest
  join: async (contestId, teamId) => {
    const response = await api.post(`/contests/${contestId}/join`, { teamId });
    return response.data;
  },

  // Leave contest
  leave: async (contestId) => {
    const response = await api.delete(`/contests/${contestId}/leave`);
    return response.data;
  },

  // Get contest leaderboard
  getLeaderboard: async (contestId, params = {}) => {
    const response = await api.get(`/contests/${contestId}/leaderboard`, { params });
    return response.data;
  },

  // Get user's contests
  getMyContests: async () => {
    const response = await api.get('/contests/my-contests');
    return response.data;
  }
};

// ================= LEADERBOARD API =================
export const leaderboardAPI = {
  // Get global leaderboard
  getGlobal: async (params = {}) => {
    const response = await api.get('/leaderboard/global', { params });
    return response.data;
  },

  // Get match leaderboard
  getMatch: async (matchId, params = {}) => {
    const response = await api.get(`/leaderboard/match/${matchId}`, { params });
    return response.data;
  },

  // Get tournament leaderboard
  getTournament: async (tournamentId, params = {}) => {
    const response = await api.get(`/leaderboard/tournament/${tournamentId}`, { params });
    return response.data;
  },

  // Get league leaderboard
  getLeague: async (leagueId, params = {}) => {
    const response = await api.get(`/leaderboard/league/${leagueId}`, { params });
    return response.data;
  },

  // Get user rank
  getUserRank: async (userId, type = 'global') => {
    const response = await api.get(`/leaderboard/user-rank/${userId}?type=${type}`);
    return response.data;
  }
};

// ================= PUSH NOTIFICATIONS API =================
export const notificationsAPI = {
  // Subscribe to notifications
  subscribe: async (subscription) => {
    const response = await api.post('/push-notifications/subscribe', {
      subscription,
      preferences: {
        matches: true,
        contests: true,
        teams: true,
        general: true
      }
    });
    return response.data;
  },

  // Unsubscribe from notifications
  unsubscribe: async () => {
    const response = await api.delete('/push-notifications/unsubscribe');
    return response.data;
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/push-notifications/preferences', { preferences });
    return response.data;
  },

  // Get notification preferences
  getPreferences: async () => {
    const response = await api.get('/push-notifications/preferences');
    return response.data;
  },

  // Get user notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/push-notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/push-notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/push-notifications/mark-all-read');
    return response.data;
  }
};

// ================= USER STATS API =================
export const userStatsAPI = {
  // Get user dashboard stats
  getDashboard: async () => {
    const response = await api.get('/user/dashboard');
    return response.data;
  },

  // Get user performance
  getPerformance: async (params = {}) => {
    const response = await api.get('/user/performance', { params });
    return response.data;
  },

  // Get user achievements
  getAchievements: async () => {
    const response = await api.get('/user/achievements');
    return response.data;
  },

  // Get user transaction history
  getTransactions: async (params = {}) => {
    const response = await api.get('/user/transactions', { params });
    return response.data;
  }
};

// Legacy API exports for backward compatibility
export const subscribeToNotifications = notificationsAPI.subscribe;
export const unsubscribeFromNotifications = notificationsAPI.unsubscribe;
export const updateNotificationPreferences = notificationsAPI.updatePreferences;

export default api;