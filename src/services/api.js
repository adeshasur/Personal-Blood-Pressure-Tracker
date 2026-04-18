/**
 * Pure Client-Side Data Service using LocalStorage
 * No Backend Required. Work instantly on any host.
 */

const STORAGE_KEY = 'bp_tracker_readings';

// --- Default Historical Data (Apr 13 - 18, 2026) ---
const INITIAL_DATA = [
  // Apr 13
  { date: '2026-04-13', systolic: 116, diastolic: 90, pulse: 72, category: 'Morning', id: 'seed-1' },
  { date: '2026-04-13', systolic: 118, diastolic: 70, pulse: 72, category: 'Afternoon', id: 'seed-2' },
  { date: '2026-04-13', systolic: 119, diastolic: 75, pulse: 72, category: 'Evening', id: 'seed-3' },
  // Apr 14
  { date: '2026-04-14', systolic: 120, diastolic: 78, pulse: 72, category: 'Morning', id: 'seed-4' },
  { date: '2026-04-14', systolic: 114, diastolic: 66, pulse: 72, category: 'Afternoon', id: 'seed-5' },
  { date: '2026-04-14', systolic: 121, diastolic: 79, pulse: 72, category: 'Evening', id: 'seed-6' },
  // Apr 15
  { date: '2026-04-15', systolic: 120, diastolic: 82, pulse: 72, category: 'Morning', id: 'seed-7' },
  { date: '2026-04-15', systolic: 119, diastolic: 72, pulse: 72, category: 'Afternoon', id: 'seed-8' },
  { date: '2026-04-15', systolic: 113, diastolic: 54, pulse: 72, category: 'Evening', id: 'seed-9' },
  // Apr 16
  { date: '2026-04-16', systolic: 131, diastolic: 73, pulse: 72, category: 'Morning', id: 'seed-10' },
  { date: '2026-04-16', systolic: 129, diastolic: 78, pulse: 72, category: 'Afternoon', id: 'seed-11' },
  { date: '2026-04-16', systolic: 135, diastolic: 112, pulse: 72, category: 'Evening', id: 'seed-12' },
  // Apr 17
  { date: '2026-04-17', systolic: 131, diastolic: 91, pulse: 72, category: 'Morning', id: 'seed-13' },
  // Apr 18
  { date: '2026-04-18', systolic: 123, diastolic: 75, pulse: 72, category: 'Afternoon', id: 'seed-14' },
];

/**
 * Internal helpers for LocalStorage
 */
const _getRawReadings = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // First time use: Initialize with historical data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

const _saveReadings = (readings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
};

/**
 * Public Service API (Matching previous interface)
 */
export const pressureService = {
  // Create new reading
  createReading: async (data) => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      const newReading = {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      readings.push(newReading);
      _saveReadings(readings);
      resolve({ data: newReading });
    });
  },

  // Get all readings (flat list)
  getReadings: async (limit = 50, offset = 0) => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      // Sort: Date DESC, CreatedAt DESC
      const sorted = [...readings].sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return (b.created_at || '').localeCompare(a.created_at || '');
      });
      resolve({ data: sorted.slice(offset, offset + limit) });
    });
  },

  // Get readings by date
  getReadingsByDate: async (date) => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      const filtered = readings.filter(r => r.date === date);
      resolve({ data: filtered });
    });
  },

  // Get all readings grouped by date (calendar view)
  getHistory: async () => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      
      // Group by date
      const groupedMap = readings.reduce((acc, r) => {
        if (!acc[r.date]) acc[r.date] = [];
        acc[r.date].push(r);
        return acc;
      }, {});

      // Sort readings within each day by category order
      const CATEGORY_ORDER = { Morning: 1, Afternoon: 2, Evening: 3 };
      
      const result = Object.entries(groupedMap)
        .map(([date, dayReadings]) => ({
          date,
          readings: dayReadings.sort((a, b) => 
            (CATEGORY_ORDER[a.category] || 4) - (CATEGORY_ORDER[b.category] || 4)
          )
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      resolve({ data: result });
    });
  },

  // Dashboard Stats (Daily Averages)
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      const groupedMap = readings.reduce((acc, r) => {
        if (!acc[r.date]) acc[r.date] = { systolic: 0, diastolic: 0, pulse: 0, count: 0 };
        acc[r.date].systolic += r.systolic;
        acc[r.date].diastolic += r.diastolic;
        acc[r.date].pulse += r.pulse;
        acc[r.date].count += 1;
        return acc;
      }, {});

      const stats = Object.entries(groupedMap)
        .map(([date, data]) => ({
          date,
          avg_systolic: data.systolic / data.count,
          avg_diastolic: data.diastolic / data.count,
          avg_pulse: data.pulse / data.count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      resolve({ data: stats });
    });
  },

  // Latest readings for today
  getLatestReadings: async () => {
    return new Promise((resolve) => {
      const today = new Date().toISOString().split('T')[0];
      const readings = _getRawReadings();
      const filtered = readings
        .filter(r => r.date === today)
        .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      resolve({ data: filtered });
    });
  },

  // Delete reading
  deleteReading: async (id) => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      const filtered = readings.filter(r => r.id !== id);
      _saveReadings(filtered);
      resolve({ data: { message: 'Deleted' } });
    });
  },

  // Identity/Legacy helper
  getReadingById: async (id) => {
    return new Promise((resolve) => {
      const readings = _getRawReadings();
      resolve({ data: readings.find(r => r.id === id) });
    });
  }
};

export default pressureService;
