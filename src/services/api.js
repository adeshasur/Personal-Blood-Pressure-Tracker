import axios from 'axios';

// On Netlify/Vercel, the API and Frontend share the same domain
// So we can use a relative path
const API_BASE_URL = '/api';

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

  // Get all readings (flat list, paginated)
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

  // Get all readings grouped by date (for calendar/history view)
  getHistory: () =>
    api.get('/pressure/history'),

  // Update reading
  updateReading: (id, data) =>
    api.put(`/pressure/${id}`, data),

  // Delete reading
  deleteReading: (id) =>
    api.delete(`/pressure/${id}`),
};

export default api;
