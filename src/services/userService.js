import { AuthenticationService } from '../api/generated/services/AuthenticationService';
import { OpenAPI } from '../api/generated/core/OpenAPI';

// Normalize BASE (generated endpoints include /api)
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:4001';
const normalizedBase = (rawBase || '').replace(/\/+$/, '');
const baseWithoutApi = normalizedBase.replace(/\/api$/, '');
OpenAPI.BASE = baseWithoutApi || 'http://localhost:4001';

// Token provider supports both keys
OpenAPI.TOKEN = () => localStorage.getItem('authToken') || localStorage.getItem('token');

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
    // Try backend update first; fallback to local persistence if server is unavailable
    try {
      const token = (localStorage.getItem('authToken') || localStorage.getItem('token'));
      const response = await fetch(`${OpenAPI.BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success && data?.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }

      return data;
    } catch (error) {
      console.error('Update profile error (server):', error);
      // Fallback: persist locally so UX remains responsive
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...userData, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        success: true,
        message: 'Profile updated locally.',
        data: updatedUser
      };
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const resp = await fetch(`${OpenAPI.BASE}/api/user/matches`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      const matches = data?.data?.matches || [];

      let teamsCreated = 0;
      let totalPoints = 0;
      const tournamentIds = new Set();

      matches.forEach(m => {
        teamsCreated += m.userTeamsCount || 0;
        if (Array.isArray(m.teams)) {
          m.teams.forEach(t => {
            totalPoints += (t.totalFantasyPoints || t.totalPoints || 0);
          });
        }
        const tid = m.tournament?._id || m.tournament?.id || m.tournament;
        if (tid) tournamentIds.add(String(tid));
      });

      return {
        success: true,
        data: {
          teamsCreated,
          tournamentsJoined: tournamentIds.size,
          totalPoints
        }
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      // Return mock stats if API fails
      return {
        success: true,
        data: {
          teamsCreated: 0,
          tournamentsJoined: 0,
          totalPoints: 0
        }
      };
    }
  }
};