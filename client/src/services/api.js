import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Poll APIs
export const pollAPI = {
  // Get all polls
  getAll: async (activeOnly = false) => {
    const response = await api.get('/polls', {
      params: { active: activeOnly }
    });
    return response.data;
  },

  // Get single poll
  getById: async (pollId) => {
    const response = await api.get(`/polls/${pollId}`);
    return response.data;
  },

  // Get poll results
  getResults: async (pollId) => {
    const response = await api.get(`/polls/${pollId}/results`);
    return response.data;
  },

  // Create new poll
  create: async (pollData) => {
    const response = await api.post('/polls', pollData);
    return response.data;
  },

  // Update poll
  update: async (pollId, updates) => {
    const response = await api.put(`/polls/${pollId}`, updates);
    return response.data;
  },

  // Toggle poll status
  toggleStatus: async (pollId) => {
    const response = await api.patch(`/polls/${pollId}/status`);
    return response.data;
  },

  // Delete poll
  delete: async (pollId) => {
    const response = await api.delete(`/polls/${pollId}`);
    return response.data;
  },
};

// Vote APIs
export const voteAPI = {
  // Submit vote
  submit: async (pollId, optionId) => {
    const response = await api.post('/votes', {
      pollId,
      optionId,
    });
    return response.data;
  },

  // Check if user has voted
  checkVoted: async (pollId) => {
    const response = await api.get(`/votes/${pollId}/check`);
    return response.data;
  },

  // Get vote stats
  getStats: async (pollId) => {
    const response = await api.get(`/votes/${pollId}/stats`);
    return response.data;
  },
};

export default api;