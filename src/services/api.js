import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Support both legacy 'authToken' and current 'token' keys
    const token =
      localStorage.getItem('authToken') ||
      localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
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
      localStorage.removeItem('token');
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
    const response = await api.put('/auth/profile', userData);
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
    const response = await api.put('/auth/reset-password', resetData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Google authentication
  googleAuth: async (tokenData) => {
    const response = await api.post('/auth/google', tokenData);
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

// ================= TOURNAMENTS API =================
export const tournamentsAPI = {
  // Get all tournaments
  getAll: async (params = {}) => {
    // Remove empty status to get all tournaments
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });
    
    const response = await api.get('/tournaments', { params: cleanParams });
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

  // Get match by key
  getByKey: async (matchKey) => {
    const response = await api.get(`/matches/key/${matchKey}`);
    return response.data;
  },

  // Get live matches
  getLive: async () => {
    const response = await api.get('/matches?status=live');
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

  // Get matches by tournament
  getByTournament: async (tournamentId) => {
    const response = await api.get(`/tournaments/${tournamentId}/matches`);
    return response.data;
  },

  // Get match players
  getPlayers: async (matchId) => {
    const response = await api.get(`/matches/${matchId}/players`);
    return response.data;
  },

  // Get match players by match ID (for team creation)
  getPlayersById: async (matchId) => {
    const response = await api.get(`/matches/${matchId}/players`);
    return response.data;
  },

  // Sync match players from Roanuz API (admin only)
  syncPlayers: async (matchKey) => {
    const response = await api.post(`/matches/${matchKey}/sync-players`);
    return response.data;
  },

  // Get match leaderboard
  getLeaderboard: async (matchId, params = {}) => {
    const response = await api.get(`/leaderboard/match/${matchId}`, { params });
    return response.data;
  },

  // Get match scorecard
  getScorecard: async (matchId) => {
    const response = await api.get(`/matches/${matchId}/scorecard`);
    return response.data;
  }
};

// ================= TEAMS API =================
export const teamsAPI = {
  // Get real teams
  getRealTeams: async (params = {}) => {
    const response = await api.get('/real-teams', { params });
    return response.data;
  },

  // Get real team by ID
  getRealTeamById: async (teamId) => {
    const response = await api.get(`/real-teams/${teamId}`);
    return response.data;
  },

  // Get all teams (legacy alias)
  getAll: async (params = {}) => {
    return await teamsAPI.getRealTeams(params);
  },

  // Get team by ID (legacy alias)
  getById: async (teamId) => {
    return await teamsAPI.getRealTeamById(teamId);
  }
};

// ================= FANTASY TEAMS API =================
export const fantasyTeamsAPI = {
  // Get all fantasy teams (for leaderboard/match viewing)
  getAll: async (params = {}) => {
    const response = await api.get('/fantasy-teams', { params });
    return response.data;
  },

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

  // Copy fantasy team
  copy: async (teamId, newName) => {
    const response = await api.post(`/fantasy-teams/${teamId}/copy`, { name: newName });
    return response.data;
  },

  // Submit fantasy team for match
  submit: async (teamId, matchId) => {
    const response = await api.put(`/fantasy-teams/${teamId}/submit`, { matchId });
    return response.data;
  },

  // Get fantasy team performance
  getPerformance: async (teamId) => {
    const response = await api.get(`/fantasy-teams/${teamId}/performance`);
    return response.data;
  },

  // Get all fantasy teams (admin or with filters)
  getAll: async (params = {}) => {
    const response = await api.get('/fantasy-teams', { params });
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

  // Get players by team
  getByTeam: async (teamId) => {
    const response = await api.get(`/real-teams/${teamId}/players`);
    return response.data;
  },

  // Get players by tournament
  getByTournament: async (tournamentId) => {
    const response = await api.get(`/tournaments/${tournamentId}/players`);
    return response.data;
  },

  // Get players by role
  getByRole: async (role) => {
    const response = await api.get(`/players?role=${role}`);
    return response.data;
  },

  // Get player statistics
  getStats: async (playerId) => {
    const response = await api.get(`/players/${playerId}/stats`);
    return response.data;
  },

  // Create player (Admin)
  create: async (playerData) => {
    const response = await api.post('/players', playerData);
    return response.data;
  },

  // Update player (Admin)
  update: async (playerId, playerData) => {
    const response = await api.put(`/players/${playerId}`, playerData);
    return response.data;
  },

  // Delete player (Admin)
  delete: async (playerId) => {
    const response = await api.delete(`/players/${playerId}`);
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

  // Get enhanced league with fantasy teams data
  getEnhanced: async (leagueId) => {
    const response = await api.get(`/leagues/${leagueId}/enhanced`);
    return response.data;
  },

  // Create league
  create: async (leagueData) => {
    const response = await api.post('/leagues', leagueData);
    return response.data;
  },

  // Create tournament league
  createTournamentLeague: async (tournamentId, leagueData) => {
    const response = await api.post(`/leagues/tournament/${tournamentId}`, leagueData);
    return response.data;
  },

  // Create match league
  createMatchLeague: async (matchId, leagueData) => {
    const response = await api.post(`/leagues/match/${matchId}`, leagueData);
    return response.data;
  },

  // Get tournament leagues
  getTournamentLeagues: async (tournamentId, params = {}) => {
    const response = await api.get(`/leagues/tournament/${tournamentId}`, { params });
    return response.data;
  },

  // Get match leagues
  getMatchLeagues: async (matchId, params = {}) => {
    const response = await api.get(`/leagues/match/${matchId}`, { params });
    return response.data;
  },

  // Generate share link
  generateShareLink: async (leagueId, baseUrl) => {
    const response = await api.post(`/leagues/${leagueId}/share`, { baseUrl });
    return response.data;
  },

  // Join by share code
  joinByShareCode: async (shareCode) => {
    const response = await api.post(`/leagues/join/${shareCode}`);
    return response.data;
  },

  // Get league preview by share code
  getLeaguePreview: async (shareCode) => {
    const response = await api.get(`/leagues/preview/${shareCode}`);
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

  // Create private league (legacy alias)
  createPrivate: async (leagueData) => {
    return await leaguesAPI.create({ ...leagueData, type: 'PRIVATE' });
  }
};

// ================= CONTESTS API =================
export const contestsAPI = {
  // Get all contests
  getAll: async (params = {}) => {
    const response = await api.get('/contests', { params });
    return response.data;
  },

  // Get contests by match
  getByMatch: async (matchId, params = {}) => {
    const response = await api.get(`/matches/${matchId}/contests`, { params });
    return response.data;
  },

  // Get contest by ID
  getById: async (contestId) => {
    const response = await api.get(`/contests/${contestId}`);
    return response.data;
  },

  // Join contest
  join: async (contestId, teamId) => {
    const response = await api.post(`/contests/${contestId}/join`, { fantasyTeamId: teamId });
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
  getMyContests: async (params = {}) => {
    const response = await api.get('/contests', { params: { ...params, myContests: true } });
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
    const response = await api.get(`/leagues/${leagueId}/leaderboard`, { params });
    return response.data;
  },

  // Get contest leaderboard
  getContest: async (contestId, params = {}) => {
    const response = await api.get(`/contests/${contestId}/leaderboard`, { params });
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
  subscribe: async (subscription, preferences = {}) => {
    const response = await api.post('/push-notifications/subscribe', {
      subscription,
      preferences: {
        matchUpdates: true,
        contestReminders: true,
        teamUpdates: true,
        leaderboardUpdates: false,
        adminAlerts: false,
        ...preferences
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

  // Get user notifications (if available)
  getNotifications: async (params = {}) => {
    const response = await api.get('/push-notifications', { params });
    return response.data;
  },

  // Mark notification as read (if available)
  markAsRead: async (notificationId) => {
    const response = await api.put(`/push-notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read (if available)
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

// ================= ADMIN API =================
export const adminAPI = {
  // Dashboard
  dashboard: {
    getStats: async () => {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    }
  },

  // User management
  users: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/users', { params });
      return response.data;
    },
    getById: async (userId) => {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    },
    update: async (userId, userData) => {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    },
    delete: async (userId) => {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    }
  },

  // Tournament management
  tournaments: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/tournaments', { params });
      return response.data;
    },
    create: async (tournamentData) => {
      const response = await api.post('/admin/tournaments', tournamentData);
      return response.data;
    },
    update: async (tournamentId, tournamentData) => {
      const response = await api.put(`/admin/tournaments/${tournamentId}`, tournamentData);
      return response.data;
    },
    delete: async (tournamentId) => {
      const response = await api.delete(`/admin/tournaments/${tournamentId}`);
      return response.data;
    }
  },

  // Match management
  matches: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/matches', { params });
      return response.data;
    },
    create: async (matchData) => {
      const response = await api.post('/admin/matches', matchData);
      return response.data;
    },
    update: async (matchId, matchData) => {
      const response = await api.put(`/admin/matches/${matchId}`, matchData);
      return response.data;
    },
    delete: async (matchId) => {
      const response = await api.delete(`/admin/matches/${matchId}`);
      return response.data;
    }
  },

  // Team management
  teams: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/teams', { params });
      return response.data;
    },
    create: async (teamData) => {
      const response = await api.post('/admin/teams', teamData);
      return response.data;
    },
    update: async (teamId, teamData) => {
      const response = await api.put(`/admin/teams/${teamId}`, teamData);
      return response.data;
    },
    delete: async (teamId) => {
      const response = await api.delete(`/admin/teams/${teamId}`);
      return response.data;
    }
  },

  // Player management
  players: {
    getAll: async (params = {}) => {
      const response = await api.get('/admin/players', { params });
      return response.data;
    },
    create: async (playerData) => {
      const response = await api.post('/admin/players', playerData);
      return response.data;
    },
    bulkCreate: async (playersData) => {
      const response = await api.post('/admin/players/bulk-create', playersData);
      return response.data;
    },
    update: async (playerId, playerData) => {
      const response = await api.put(`/admin/players/${playerId}`, playerData);
      return response.data;
    },
    delete: async (playerId) => {
      const response = await api.delete(`/admin/players/${playerId}`);
      return response.data;
    }
  }
};

// ================= CONTACT API =================
export const contactAPI = {
  // Send contact message
  sendMessage: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  }
};

// ================= WALLET API =================
export const walletAPI = {
  // Get wallet summary
  getSummary: async () => {
    const response = await api.get('/wallet/summary');
    return response.data;
  },
  // Get wallet transactions
  getTransactions: async (params = {}) => {
    const response = await api.get('/wallet/transactions', { params });
    return response.data;
  },
  // Get wallet balance
  getBalance: async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  }
};

// Legacy API exports for backward compatibility
export const subscribeToNotifications = notificationsAPI.subscribe;
export const unsubscribeFromNotifications = notificationsAPI.unsubscribe;
export const updateNotificationPreferences = notificationsAPI.updatePreferences;

// Wallet API exports for backward compatibility
export const getWalletSummary = walletAPI.getSummary;
export const getWalletTransactions = walletAPI.getTransactions;

export default api;