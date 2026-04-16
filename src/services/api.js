// Local Storage Implementation of Pressure Service
// Replacing Axios with localStorage for a backend-less experience on Vercel

const STORAGE_KEY = 'blood_pressure_readings';

// Helper to get all readings from localStorage
const getAllReadings = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save all readings to localStorage
const saveAllReadings = (readings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
};

export const pressureService = {
  // Create new reading
  createReading: async (data) => {
    const readings = getAllReadings();
    const newReading = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    readings.push(newReading);
    saveAllReadings(readings);
    return { data: newReading };
  },

  // Get all readings
  getReadings: async (limit = 50, offset = 0) => {
    const readings = getAllReadings();
    // Sort by date descending
    const sorted = readings.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginated = sorted.slice(offset, offset + limit);
    return { data: paginated };
  },

  // Get reading by ID
  getReadingById: async (id) => {
    const readings = getAllReadings();
    const reading = readings.find((r) => r.id === id);
    return { data: reading };
  },

  // Get readings by date
  getReadingsByDate: async (date) => {
    const readings = getAllReadings();
    const filtered = readings.filter((r) => r.date === date);
    return { data: filtered };
  },

  // Get dashboard stats (grouped by date)
  getDashboardStats: async () => {
    const readings = getAllReadings();
    const statsMap = {};

    readings.forEach((r) => {
      const date = r.date;
      if (!statsMap[date]) {
        statsMap[date] = { systolic: [], diastolic: [], pulse: [] };
      }
      statsMap[date].systolic.push(Number(r.systolic));
      statsMap[date].diastolic.push(Number(r.diastolic));
      statsMap[date].pulse.push(Number(r.pulse));
    });

    const stats = Object.keys(statsMap).map((date) => {
      const dayData = statsMap[date];
      return {
        date,
        avg_systolic: dayData.systolic.reduce((a, b) => a + b, 0) / dayData.systolic.length,
        avg_diastolic: dayData.diastolic.reduce((a, b) => a + b, 0) / dayData.diastolic.length,
        avg_pulse: dayData.pulse.reduce((a, b) => a + b, 0) / dayData.pulse.length,
      };
    });

    // Sort by date ascending for charts
    stats.sort((a, b) => new Date(a.date) - new Date(b.date));

    return { data: stats };
  },

  // Get latest readings (e.g., for today)
  getLatestReadings: async () => {
    const readings = getAllReadings();
    const today = new Date().toISOString().split('T')[0];
    const todayReadings = readings.filter((r) => r.date === today);
    return { data: todayReadings };
  },

  // Update reading
  updateReading: async (id, data) => {
    let readings = getAllReadings();
    readings = readings.map((r) => (r.id === id ? { ...r, ...data } : r));
    saveAllReadings(readings);
    return { data: { id, ...data } };
  },

  // Delete reading
  deleteReading: async (id) => {
    let readings = getAllReadings();
    readings = readings.filter((r) => r.id !== id);
    saveAllReadings(readings);
    return { data: { message: 'Reading deleted successfully' } };
  },
};

export default pressureService;
