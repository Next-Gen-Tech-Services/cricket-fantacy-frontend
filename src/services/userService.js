import { AuthenticationService } from '../api/generated/services/AuthenticationService';
import { OpenAPI } from '../api/generated/core/OpenAPI';

// Set the API base URL (without /api since it's included in the generated service endpoints)
OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001';

// Set the token for authenticated requests
OpenAPI.TOKEN = () => localStorage.getItem('authToken');

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await AuthenticationService.getApiAuthMe();
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      // Return mock data if API fails
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        success: true,
        data: {
          name: userData.name || 'Admin User',
          email: userData.email || 'admin@cricketfantasy.com',
          phone: userData.phone || '',
          location: userData.location || ''
        }
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      // Since there's no direct update profile endpoint in the generated API,
      // we'll use a generic API call
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${OpenAPI.BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update local storage with new user data
      if (data.success && data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      // Mock success for now if API fails
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...userData, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        success: true,
        message: 'Profile updated successfully!',
        data: updatedUser
      };
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${OpenAPI.BASE}/api/auth/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user stats error:', error);
      // Return mock stats if API fails
      return {
        success: true,
        data: {
          teamsCreated: 5,
          tournamentsJoined: 12,
          totalPoints: 2450
        }
      };
    }
  }
};