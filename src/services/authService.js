import { authAPI } from './api';

// Auth service with error handling and token management
export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data.token) {
        // Store auth data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error;
    }
  },

  // Register user (signup)
  signup: async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data.token) {
        // Store auth data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || token === 'undefined' || token === 'null') {
        return null;
      }
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      
      if (response.success) {
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Password change error:', error);
      throw error.response?.data || error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error.response?.data || error;
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error.response?.data || error;
    }
  },

  // Refresh user profile
  refreshProfile: async () => {
    try {
      const response = await authAPI.getProfile();
      
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
      // If refresh fails, logout user
      this.logout();
      throw error.response?.data || error;
    }
  },

  // Verify token with server (legacy support)
  verifyToken: async () => {
    return this.refreshProfile();
  }
};

export default authService;