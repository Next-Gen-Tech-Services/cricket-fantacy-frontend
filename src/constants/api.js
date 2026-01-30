// API Constants and Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4001',
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },

  // Tournaments
  TOURNAMENTS: {
    BASE: '/tournaments',
    BY_ID: (id) => `/tournaments/${id}`
  },

  // Matches
  MATCHES: {
    BASE: '/matches',
    BY_ID: (id) => `/matches/${id}`,
    BY_KEY: (key) => `/matches/key/${key}`,
    BY_TOURNAMENT: (tournamentId) => `/tournaments/${tournamentId}/matches`,
    PLAYERS: (id) => `/matches/${id}/players`,
    LEADERBOARD: (id) => `/matches/${id}/leaderboard`,
    CONTESTS: (id) => `/matches/${id}/contests`,
    SCORECARD: (id) => `/matches/${id}/scorecard`
  },

  // Real Teams
  REAL_TEAMS: {
    BASE: '/real-teams',
    BY_ID: (id) => `/real-teams/${id}`
  },

  // Fantasy Teams
  FANTASY_TEAMS: {
    BASE: '/fantasy-teams',
    BY_ID: (id) => `/fantasy-teams/${id}`,
    COPY: (id) => `/fantasy-teams/${id}/copy`,
    SUBMIT: (id) => `/fantasy-teams/${id}/submit`,
    PERFORMANCE: (id) => `/fantasy-teams/${id}/performance`
  },

  // Players
  PLAYERS: {
    BASE: '/players',
    BY_ID: (id) => `/players/${id}`,
    BY_TEAM: (teamId) => `/real-teams/${teamId}/players`,
    BY_TOURNAMENT: (tournamentId) => `/tournaments/${tournamentId}/players`,
    STATS: (id) => `/players/${id}/stats`
  },

  // Contests
  CONTESTS: {
    BASE: '/contests',
    BY_ID: (id) => `/contests/${id}`,
    BY_MATCH: (matchId) => `/matches/${matchId}/contests`,
    JOIN: (id) => `/contests/${id}/join`,
    LEAVE: (id) => `/contests/${id}/leave`,
    LEADERBOARD: (id) => `/contests/${id}/leaderboard`
  },

  // Leagues
  LEAGUES: {
    BASE: '/leagues',
    BY_ID: (id) => `/leagues/${id}`,
    JOIN: (id) => `/leagues/${id}/join`,
    LEAVE: (id) => `/leagues/${id}/leave`,
    LEADERBOARD: (id) => `/leagues/${id}/leaderboard`,
    MY_LEAGUES: '/leagues/my-leagues'
  },

  // Leaderboards
  LEADERBOARD: {
    GLOBAL: '/leaderboard',
    MATCH: (matchId) => `/matches/${matchId}/leaderboard`,
    TOURNAMENT: (tournamentId) => `/tournaments/${tournamentId}/leaderboard`,
    CONTEST: (contestId) => `/contests/${contestId}/leaderboard`,
    LEAGUE: (leagueId) => `/leagues/${leagueId}/leaderboard`,
    USER_RANK: (userId, type) => `/leaderboard/user-rank/${userId}?type=${type}`
  },

  // Push Notifications
  PUSH_NOTIFICATIONS: {
    SUBSCRIBE: '/push-notifications/subscribe',
    UNSUBSCRIBE: '/push-notifications/unsubscribe',
    PREFERENCES: '/push-notifications/preferences'
  },

  // Wallet
  WALLET: {
    SUMMARY: '/wallet/summary',
    TRANSACTIONS: '/wallet/transactions',
    BALANCE: '/wallet/balance'
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard/stats',
    USERS: {
      BASE: '/admin/users',
      BY_ID: (id) => `/admin/users/${id}`
    },
    TOURNAMENTS: {
      BASE: '/admin/tournaments',
      BY_ID: (id) => `/admin/tournaments/${id}`
    },
    MATCHES: {
      BASE: '/admin/matches',
      BY_ID: (id) => `/admin/matches/${id}`
    },
    TEAMS: {
      BASE: '/admin/teams',
      BY_ID: (id) => `/admin/teams/${id}`
    },
    PLAYERS: {
      BASE: '/admin/players',
      BY_ID: (id) => `/admin/players/${id}`,
      BULK_CREATE: '/admin/players/bulk-create'
    }
  },

  // System
  HEALTH: '/health',
  API_INFO: '/api'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Player Roles
export const PLAYER_ROLES = {
  BATSMAN: 'BATSMAN',
  BOWLER: 'BOWLER',
  ALL_ROUNDER: 'ALL_ROUNDER',
  WICKET_KEEPER: 'WICKET_KEEPER'
};

// Match Statuses
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Tournament Statuses
export const TOURNAMENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
};

// Fantasy Team Player Roles
export const FANTASY_PLAYER_ROLES = {
  PLAYER: 'PLAYER',
  CAPTAIN: 'CAPTAIN',
  VICE_CAPTAIN: 'VICE_CAPTAIN'
};

// Contest Types
export const CONTEST_TYPES = {
  HEAD_TO_HEAD: 'HEAD_TO_HEAD',
  LEAGUE: 'LEAGUE',
  MEGA_CONTEST: 'MEGA_CONTEST',
  PRIVATE: 'PRIVATE',
  PRACTICE: 'PRACTICE'
};

// League Types
export const LEAGUE_TYPES = {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
  INVITE_ONLY: 'INVITE_ONLY'
};

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  TOURNAMENTS: 'tournaments',
  LIVE_MATCHES: 'live_matches',
  FANTASY_TEAMS: 'fantasy_teams',
  PLAYERS: 'players'
};