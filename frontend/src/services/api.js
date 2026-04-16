import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pressureService = {
  // Create new reading
  createReading: (data) =>
    api.post('/pressure', data),

  // Get all readings
  getReadings: (limit = 50, offset = 0) =>
    api.get('/pressure', { params: { limit, offset } }),

  // Get reading by ID
  getReadingById: (id) =>
    api.get(`/pressure/${id}`),

  // Get readings by date
  getReadingsByDate: (date) =>
    api.get(`/pressure/date/${date}`),

  // Get dashboard stats
  getDashboardStats: () =>
    api.get('/pressure/dashboard/stats'),

  // Get latest readings
  getLatestReadings: () =>
    api.get('/pressure/latest'),

  // Update reading
  updateReading: (id, data) =>
    api.put(`/pressure/${id}`, data),

  // Delete reading
  deleteReading: (id) =>
    api.delete(`/pressure/${id}`),
};

export default api;
