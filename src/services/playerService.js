import axios from 'axios';

const API_BASE = '/api/players';

const PlayerService = {
  async resolveKeys(keys) {
    try {
      const response = await axios.post(`${API_BASE}/resolve-keys`, { keys });
      return response.data; // standardized: { success, message, data }
    } catch (error) {
      console.error('Error resolving player keys:', error);
      throw error;
    }
  }
};

export default PlayerService;
