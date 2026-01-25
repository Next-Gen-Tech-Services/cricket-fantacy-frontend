import { HTTP_STATUS } from '../constants/api';

// API Response wrapper for consistent handling
export class ApiResponse {
  constructor(data, status, message = '') {
    this.success = status >= 200 && status < 300;
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static success(data, message = 'Success') {
    return new ApiResponse(data, HTTP_STATUS.OK, message);
  }

  static error(message, status = HTTP_STATUS.INTERNAL_SERVER_ERROR, data = null) {
    return new ApiResponse(data, status, message);
  }
}

// API Error class for better error handling
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || data?.error || 'Server error occurred';
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Handle authentication error
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        throw new ApiError('Authentication failed. Please login again.', status, data);
      
      case HTTP_STATUS.FORBIDDEN:
        throw new ApiError('Access denied. Insufficient permissions.', status, data);
      
      case HTTP_STATUS.NOT_FOUND:
        throw new ApiError('Resource not found.', status, data);
      
      case HTTP_STATUS.BAD_REQUEST:
        throw new ApiError(message, status, data);
      
      default:
        throw new ApiError(message, status, data);
    }
  } else if (error.request) {
    // Network error
    throw new ApiError('Network error. Please check your connection.', 0, null);
  } else {
    // Other error
    throw new ApiError(error.message || 'An unexpected error occurred.', 0, null);
  }
};

// Format API response data
export const formatResponse = (response) => {
  if (response.data) {
    return response.data;
  }
  return response;
};

// Request/Response interceptor utilities
export const addAuthToken = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const handleResponseError = (error) => {
  return Promise.reject(handleApiError(error));
};

// Local storage utilities
export const tokenUtils = {
  get: () => localStorage.getItem('authToken'),
  set: (token) => localStorage.setItem('authToken', token),
  remove: () => localStorage.removeItem('authToken'),
  exists: () => !!localStorage.getItem('authToken')
};

export const userUtils = {
  get: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  set: (user) => localStorage.setItem('user', JSON.stringify(user)),
  remove: () => localStorage.removeItem('user'),
  exists: () => !!localStorage.getItem('user')
};

// API cache utilities
export const cacheUtils = {
  get: (key) => {
    try {
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp, expiry } = JSON.parse(cached);
      if (Date.now() > timestamp + expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  
  set: (key, data, expiryMs = 5 * 60 * 1000) => { // 5 minutes default
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: expiryMs
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
    } catch {
      // Ignore cache errors
    }
  },
  
  remove: (key) => sessionStorage.removeItem(key),
  clear: () => sessionStorage.clear()
};

// Notification utilities
export const notificationUtils = {
  checkSupport: () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  requestPermission: async () => {
    if (!notificationUtils.checkSupport()) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  getSubscription: async () => {
    if (!notificationUtils.checkSupport()) return null;

    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  }
};

// Data transformation utilities
export const transformUtils = {
  // Transform match data for display
  transformMatch: (match) => ({
    ...match,
    startTime: new Date(match.startedAt * 1000),
    endTime: new Date(match.expectedEndedAt * 1000),
    isLive: match.status === 'live',
    isUpcoming: match.status === 'scheduled',
    isCompleted: match.status === 'completed'
  }),

  // Transform player data for fantasy team selection
  transformPlayer: (player) => ({
    ...player,
    displayName: player.shortName || player.name,
    roleDisplay: player.role.replace('_', ' '),
    isAffordable: (budget) => player.credits <= budget,
    teamShortName: player.team?.shortName || player.team?.name || 'Unknown'
  }),

  // Transform fantasy team for display
  transformFantasyTeam: (team) => ({
    ...team,
    playerCount: team.players?.length || 0,
    captainName: team.players?.find(p => p.role === 'CAPTAIN')?.player?.name || 'Not selected',
    viceCaptainName: team.players?.find(p => p.role === 'VICE_CAPTAIN')?.player?.name || 'Not selected',
    totalCredits: team.players?.reduce((total, p) => total + (p.player?.credits || 0), 0) || 0
  })
};

// Validation utilities
export const validationUtils = {
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  isStrongPassword: (password) => {
    return password.length >= 6 && 
           /[A-Za-z]/.test(password) && 
           /[0-9]/.test(password);
  },

  isValidFantasyTeam: (team) => {
    if (!team.players || team.players.length === 0) return false;
    
    const captainCount = team.players.filter(p => p.role === 'CAPTAIN').length;
    const viceCaptainCount = team.players.filter(p => p.role === 'VICE_CAPTAIN').length;
    
    return captainCount === 1 && viceCaptainCount === 1 && team.players.length <= 11;
  }
};